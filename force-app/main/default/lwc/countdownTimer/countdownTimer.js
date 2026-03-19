// countdownTimer.js
import { LightningElement, track } from 'lwc';

const STORAGE_KEY = 'sf_countdown_settings';

const QUOTES = [
    "Every expert was once a beginner. Keep going! 💪",
    "You don't have to be great to start, but you have to start to be great. 🚀",
    "Consistency beats perfection. Show up every day. 🔥",
    "Progress, not perfection. One topic at a time. ⚡",
    "The pain of discipline is nothing compared to the pain of regret. 🏆",
    "Your future self is watching. Make them proud. 🌟",
    "Small daily improvements lead to stunning results. 📈",
    "Don't count the days — make the days count. ⏳",
    "Success is the sum of small efforts repeated day in, day out. 💎",
    "Salesforce certified or bust. You've got this! ☁️",
];

const RADIUS = 96;
const CIRC = +(2 * Math.PI * RADIUS).toFixed(2);

export default class CountdownTimer extends LightningElement {
    @track showSettings = false;
    @track goalLabel = 'Salesforce 100 Day Challenge';
    @track totalDays = 100;
    @track startDate = '';
    @track dailyGoal = 'Study 2 hours of Salesforce every day';
    @track hours = '00';
    @track minutes = '00';
    @track seconds = '00';
    @track motivationQuote = QUOTES[0];

    _interval = null;
    _quoteIdx = 0;

    // ── Lifecycle ──────────────────────────────────────
    connectedCallback() {
        this._loadSettings();
        this._tick();
        this._interval = setInterval(() => this._tick(), 1000);
    }

    disconnectedCallback() {
        clearInterval(this._interval);
    }

    // ── Computed getters ───────────────────────────────
    get circumference() { return CIRC; }

    get _endDate() {
        if (!this.startDate) return null;
        const d = new Date(this.startDate);
        d.setDate(d.getDate() + Number(this.totalDays));
        return d;
    }

    get daysLeft() {
        const end = this._endDate;
        if (!end) return this.totalDays;
        const diff = Math.ceil((end - new Date()) / 86400000);
        return Math.max(0, diff);
    }

    get daysPassed() {
        return Math.max(0, Number(this.totalDays) - this.daysLeft);
    }

    get percentDone() {
        if (!this.totalDays) return 0;
        return Math.min(100, Math.round((this.daysPassed / this.totalDays) * 100));
    }

    get strokeOffset() {
        return +(CIRC * (1 - this.percentDone / 100)).toFixed(2);
    }

    get deadlineFormatted() {
        const end = this._endDate;
        if (!end) return '—';
        return end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    get statusText() {
        if (!this.startDate) return 'Set your start date to begin ⚙️';
        if (this.daysLeft === 0) return '🎉 Challenge Complete! You did it!';
        if (this.daysLeft <= 10) return `⚠️ Final stretch! Only ${this.daysLeft} days left!`;
        if (this.daysLeft <= 25) return `🔥 Almost there! Keep pushing!`;
        return `🟢 Challenge in progress — stay consistent!`;
    }

    get footerDotStyle() {
        const c = this.daysLeft === 0 ? '#22c55e'
            : this.daysLeft <= 10 ? '#ef4444'
                : this.daysLeft <= 25 ? '#f59e0b'
                    : '#22c55e';
        return `background:${c}; box-shadow: 0 0 6px ${c};`;
    }

    get milestones() {
        const checkpoints = [
            { pct: 25, label: '25%' },
            { pct: 50, label: '50%' },
            { pct: 75, label: '75%' },
            { pct: 100, label: '100%' },
        ];
        return checkpoints.map(cp => ({
            label: cp.label,
            cls: this.percentDone >= cp.pct
                ? 'milestone-item reached'
                : 'milestone-item',
        }));
    }

    // ── Tick ──────────────────────────────────────────
    _tick() {
        const now = new Date();
        this.hours = String(now.getHours()).padStart(2, '0');
        this.minutes = String(now.getMinutes()).padStart(2, '0');
        this.seconds = String(now.getSeconds()).padStart(2, '0');

        // Rotate quote every 30 seconds
        if (now.getSeconds() % 30 === 0) {
            this._quoteIdx = (this._quoteIdx + 1) % QUOTES.length;
            this.motivationQuote = QUOTES[this._quoteIdx];
        }
    }

    // ── Settings handlers ─────────────────────────────
    toggleSettings() { this.showSettings = !this.showSettings; }

    handleGoalLabel(e) { this.goalLabel = e.target.value; }
    handleTotalDays(e) { this.totalDays = Number(e.target.value); }
    handleStartDate(e) { this.startDate = e.target.value; }
    handleDailyGoal(e) { this.dailyGoal = e.target.value; }

    saveSettings() {
        if (!this.startDate) {
            // default to today
            this.startDate = new Date().toISOString().split('T')[0];
        }
        const data = {
            goalLabel: this.goalLabel,
            totalDays: this.totalDays,
            startDate: this.startDate,
            dailyGoal: this.dailyGoal,
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) { }
        this.showSettings = false;
    }

    _loadSettings() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const d = JSON.parse(raw);
            this.goalLabel = d.goalLabel || this.goalLabel;
            this.totalDays = d.totalDays || this.totalDays;
            this.startDate = d.startDate || '';
            this.dailyGoal = d.dailyGoal || this.dailyGoal;
        } catch (_) { }
    }
}