// force-app/main/default/lwc/gymTracker/gymTracker.js
import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getLogs from '@salesforce/apex/GymTrackerController.getLogs';
import saveLog from '@salesforce/apex/GymTrackerController.saveLog';
import deleteLog from '@salesforce/apex/GymTrackerController.deleteLog';

const PAGE_SIZE = 10;
const MILESTONES = [
    { target: 10, icon: '🥉', label: '10 Sessions' },
    { target: 25, icon: '🥈', label: '25 Sessions' },
    { target: 50, icon: '🥇', label: '50 Sessions' },
    { target: 100, icon: '🏆', label: '100 Sessions' },
];
const MOOD_MAP = {
    Beast: { label: '💪 Beast', cls: 'mood-chip mood-beast' },
    Good: { label: '😊 Good', cls: 'mood-chip mood-good' },
    Okay: { label: '😐 Okay', cls: 'mood-chip mood-okay' },
    Tired: { label: '😴 Tired', cls: 'mood-chip mood-tired' },
};
const TYPE_COLOR = {
    Strength: 'type-chip type-strength',
    Cardio: 'type-chip type-cardio',
    Yoga: 'type-chip type-yoga',
    Mixed: 'type-chip type-mixed',
    HIIT: 'type-chip type-hiit',
    'Rest Day': 'type-chip type-rest',
};

export default class GymTracker extends LightningElement {

    // ── Wire ─────────────────────────────────────────────────
    @track _wiredResult;
    @track rawLogs = [];
    @track isLoading = true;

    @wire(getLogs)
    wiredLogs(result) {
        this._wiredResult = result;
        if (result.data) {
            this.rawLogs = result.data;
            this.isLoading = false;
        } else if (result.error) {
            this.isLoading = false;
        }
    }

    // ── Filters ───────────────────────────────────────────────
    @track searchTerm = '';
    @track filterFrom = '';
    @track filterTo = '';
    @track filterType = '';
    @track sortCol = 'Log_Date__c';
    @track sortDir = 'desc';
    @track currentPage = 1;

    // ── Modal ─────────────────────────────────────────────────
    @track showModal = false;
    @track isSaving = false;
    @track formError = '';
    @track form = {
        logDate: new Date().toISOString().split('T')[0],
        duration: '',
        workoutType: '',
        mood: '',
        comments: '',
    };

    // ── Delete Modal ──────────────────────────────────────────
    @track showDeleteModal = false;
    _deleteId = null;

    // ── Mood options ──────────────────────────────────────────
    get moodOptions() {
        return ['Beast', 'Good', 'Okay', 'Tired'].map(v => ({
            value: v,
            label: MOOD_MAP[v].label,
            cls: `mood-option${this.form.mood === v ? ' mood-selected' : ''}`,
        }));
    }

    // ── Filtered & sorted logs ────────────────────────────────
    get filteredLogs() {
        let logs = [...this.rawLogs];

        if (this.searchTerm) {
            const q = this.searchTerm.toLowerCase();
            logs = logs.filter(l =>
                (l.Comments__c || '').toLowerCase().includes(q) ||
                (l.Workout_Type__c || '').toLowerCase().includes(q)
            );
        }
        if (this.filterFrom) {
            logs = logs.filter(l => l.Log_Date__c >= this.filterFrom);
        }
        if (this.filterTo) {
            logs = logs.filter(l => l.Log_Date__c <= this.filterTo);
        }
        if (this.filterType) {
            logs = logs.filter(l => l.Workout_Type__c === this.filterType);
        }

        // Sort
        const col = this.sortCol, dir = this.sortDir === 'asc' ? 1 : -1;
        logs.sort((a, b) => {
            const av = a[col] || '', bv = b[col] || '';
            return av < bv ? -dir : av > bv ? dir : 0;
        });

        return logs;
    }

    get filteredCount() { return this.filteredLogs.length; }
    get hasLogs() { return this.filteredLogs.length > 0; }

    // ── Pagination ────────────────────────────────────────────
    get totalPages() { return Math.max(1, Math.ceil(this.filteredLogs.length / PAGE_SIZE)); }
    get isPrevDisabled() { return this.currentPage <= 1; }
    get isNextDisabled() { return this.currentPage >= this.totalPages; }

    get displayedLogs() {
        const start = (this.currentPage - 1) * PAGE_SIZE;
        return this.filteredLogs.slice(start, start + PAGE_SIZE).map((l, i) => ({
            ...l,
            rowNum: start + i + 1,
            rowCls: i % 2 === 0 ? 'row-even' : 'row-odd',
            formattedDate: this._formatDate(l.Log_Date__c),
            moodLabel: (MOOD_MAP[l.Mood__c] || {}).label || l.Mood__c || '—',
            moodCls: (MOOD_MAP[l.Mood__c] || {}).cls || 'mood-chip',
            typeCls: TYPE_COLOR[l.Workout_Type__c] || 'type-chip',
        }));
    }

    prevPage() { if (this.currentPage > 1) this.currentPage--; }
    nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }

    // ── Sort icons ────────────────────────────────────────────
    get sortIcons() {
        const up = '↑', dn = '↓', both = '↕';
        const cols = ['Log_Date__c', 'Duration__c', 'Workout_Type__c'];
        const icons = {};
        cols.forEach(c => {
            icons[c] = c === this.sortCol ? (this.sortDir === 'asc' ? up : dn) : both;
        });
        return icons;
    }
    handleSort(e) {
        const col = e.currentTarget.dataset.col;
        if (this.sortCol === col) {
            this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortCol = col;
            this.sortDir = 'desc';
        }
        this.currentPage = 1;
    }

    // ── Stats ─────────────────────────────────────────────────
    get totalSessions() { return this.rawLogs.length; }

    get totalHours() {
        const mins = this.rawLogs.reduce((s, l) => s + (l.Duration__c || 0), 0);
        return (mins / 60).toFixed(1);
    }

    get currentStreak() {
        if (!this.rawLogs.length) return 0;
        const sorted = [...this.rawLogs].sort((a, b) =>
            a.Log_Date__c > b.Log_Date__c ? -1 : 1);
        let streak = 0;
        let expected = new Date().toISOString().split('T')[0];
        for (const l of sorted) {
            if (l.Log_Date__c === expected ||
                l.Log_Date__c === this._addDays(expected, -1)) {
                streak++;
                expected = this._addDays(l.Log_Date__c, -1);
            } else break;
        }
        return streak;
    }

    get thisMonthCount() {
        const now = new Date();
        const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return this.rawLogs.filter(l => (l.Log_Date__c || '').startsWith(ym)).length;
    }

    // ── Milestones ────────────────────────────────────────────
    get milestones() {
        return MILESTONES.map(m => ({
            ...m,
            cls: `badge${this.totalSessions >= m.target ? ' badge-unlocked' : ' badge-locked'}`,
            title: this.totalSessions >= m.target
                ? `✅ Unlocked: ${m.label}`
                : `🔒 ${m.target - this.totalSessions} more sessions to unlock`,
        }));
    }

    // ── Search / filter handlers ──────────────────────────────
    handleSearch(e) { this.searchTerm = e.target.value; this.currentPage = 1; }
    handleFilterFrom(e) { this.filterFrom = e.target.value; this.currentPage = 1; }
    handleFilterTo(e) { this.filterTo = e.target.value; this.currentPage = 1; }
    handleTypeFilter(e) { this.filterType = e.target.value; this.currentPage = 1; }
    clearSearch() { this.searchTerm = ''; this.currentPage = 1; }
    clearFilters() {
        this.searchTerm = ''; this.filterFrom = '';
        this.filterTo = ''; this.filterType = '';
        this.currentPage = 1;
    }

    // ── Modal handlers ────────────────────────────────────────
    openModal() {
        this.form = {
            logDate: new Date().toISOString().split('T')[0],
            duration: '',
            workoutType: '',
            mood: '',
            comments: '',
        };
        this.formError = '';
        this.showModal = true;
    }
    closeModal() { this.showModal = false; }

    handleFormChange(e) {
        const f = e.currentTarget.dataset.field;
        this.form = { ...this.form, [f]: e.target.value };
        this.formError = '';
    }
    handleMoodSelect(e) {
        this.form = { ...this.form, mood: e.currentTarget.dataset.mood };
    }

    handleSave() {
        if (!this.form.logDate) { this.formError = 'Date is required.'; return; }
        if (!this.form.duration) { this.formError = 'Duration is required.'; return; }
        if (this.form.duration < 1) { this.formError = 'Duration must be at least 1 minute.'; return; }

        this.isSaving = true;
        saveLog({
            logDate: this.form.logDate,
            duration: parseInt(this.form.duration, 10),
            workoutType: this.form.workoutType,
            mood: this.form.mood,
            comments: this.form.comments,
        })
            .then(() => {
                this.showModal = false;
                this.isSaving = false;
                return refreshApex(this._wiredResult);
            })
            .catch(err => {
                this.formError = err.body ? err.body.message : 'Save failed. Please try again.';
                this.isSaving = false;
            });
    }

    // ── Delete handlers ───────────────────────────────────────
    handleDeleteClick(e) {
        this._deleteId = e.currentTarget.dataset.id;
        this.showDeleteModal = true;
    }
    closeDeleteModal() { this.showDeleteModal = false; this._deleteId = null; }

    confirmDelete() {
        deleteLog({ recordId: this._deleteId })
            .then(() => {
                this.showDeleteModal = false;
                this._deleteId = null;
                return refreshApex(this._wiredResult);
            })
            .catch(() => { this.showDeleteModal = false; });
    }

    // ── Helpers ───────────────────────────────────────────────
    _formatDate(d) {
        if (!d) return '—';
        const dt = new Date(d + 'T00:00:00');
        return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    _addDays(dateStr, n) {
        const d = new Date(dateStr + 'T00:00:00');
        d.setDate(d.getDate() + n);
        return d.toISOString().split('T')[0];
    }
}