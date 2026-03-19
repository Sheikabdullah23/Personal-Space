import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// const ROADMAP_URL = 'https://claude.ai/public/artifacts/3aa3c009-b908-48f4-86c3-0d8b55066bf4';

export default class RoadmapLauncher extends NavigationMixin(LightningElement) {
    openRoadmap() {
        // window.open(ROADMAP_URL, '_blank', 'noopener,noreferrer');
        this[NavigationMixin.Navigate]({
            type: 'standard__navItemPage',
            attributes: { apiName: 'Learn_Track' } // ← Your Lightning Tab API name
        });
    }

    copyEmail() {
        navigator.clipboard.writeText('salesminuscule@gmail.com').catch(() => { });
    }
}