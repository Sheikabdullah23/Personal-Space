import { LightningElement } from 'lwc';
import { NavigationMixin }  from 'lightning/navigation';

// ── Experience Cloud site page URL ──────────────────────────
const EXPERIENCE_SITE_URL = 'https://orgfarm-8e2b910f80-dev-ed.develop.my.site.com/assistance/s/personal-assistance-app/salesforce-developer-roadmap';

// ── Internal Salesforce Lightning Tab API name ───────────────
const INTERNAL_TAB_API    = 'Learn_Track';

export default class RoadmapLauncher extends NavigationMixin(LightningElement) {

    // ── Detect if running inside an Experience Cloud site ────
    get _isExperienceSite() {
        const url = window.location.href;
        return (
            url.includes('.site.com')   ||   // Experience Cloud domain
            url.includes('/s/')         ||   // Community path prefix
            url.includes('community')   ||   // Legacy community URL
            url.includes('digitalexperiences.salesforce.com')
        );
    }

    // ── Main navigation handler ───────────────────────────────
    openRoadmap() {
        if (this._isExperienceSite) {
            // ── Experience Cloud → Navigate to site page ──────
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: EXPERIENCE_SITE_URL
                }
            });
        } else {
            // ── Internal Salesforce → Navigate to Lightning Tab
            this[NavigationMixin.Navigate]({
                type: 'standard__navItemPage',
                attributes: {
                    apiName: INTERNAL_TAB_API
                }
            });
        }
    }

    copyEmail() {
        navigator.clipboard.writeText('salesminuscule@gmail.com').catch(() => { });
    }
}