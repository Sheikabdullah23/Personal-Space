// force-app/main/default/lwc/gymCard/gymCard.js
import { LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getMiniStats from '@salesforce/apex/GymTrackerController.getMiniStats';

const MILESTONES = [
    { target: 10, icon: '🥉', label: '10 Sessions' },
    { target: 25, icon: '🥈', label: '25 Sessions' },
    { target: 50, icon: '🥇', label: '50 Sessions' },
    { target: 100, icon: '🏆', label: '100 Sessions' },
];

export default class GymCard extends NavigationMixin(LightningElement) {

    @track isLoading = true;
    @track totalSessions = 0;
    @track totalHours = '0.0';
    @track currentStreak = 0;

    @wire(getMiniStats)
    wiredStats({ data, error }) {
        if (data) {
            this.totalSessions = data.totalSessions;
            this.totalHours = data.totalHours;
            this.currentStreak = data.currentStreak;
            this.isLoading = false;
        } else if (error) {
            this.isLoading = false;
        }
    }

    get milestones() {
        return MILESTONES.map(m => ({
            ...m,
            cls: `gc-badge${this.totalSessions >= m.target ? ' gc-badge-on' : ' gc-badge-off'}`,
            title: this.totalSessions >= m.target
                ? `✅ ${m.label} unlocked!`
                : `🔒 Need ${m.target - this.totalSessions} more sessions`,
        }));
    }

    openTracker() {
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: 'Gym_Tracker' } // ← Your Lightning Tab API name
        });
    }
}