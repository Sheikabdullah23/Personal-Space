/**
 * ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
 * Class Name      : SFRoadmapControllerTest
 * Author          : <YourName>
 * Created Date    : Mar 10, 2026
 * Last Modified By: <YourName>
 * Last Modified On: Mar 10, 2026
 * Description     : This class implements for......
 *  
 * Change History  :
 *  Date          │   Author     │   Change
 * ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
 *  Mar 10, 2026  │ <YourName>   │ Initial version
 * ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
 */

@isTest
private class SFRoadmapControllerTest {
	@isTest
    static void testLoadEmptyProgress() {
        String result = SFRoadmapController.loadProgress();
        System.assertEquals('{}', result, 'Empty progress should return {}');
    }

    @isTest
    static void testSaveAndLoadProgress() {
        String json = '{"beginner-core":["Topic A","Topic B"]}';
        SFRoadmapController.saveProgress(json);

        String loaded = SFRoadmapController.loadProgress();
        System.assertEquals(json, loaded, 'Loaded progress should match saved');
    }

    @isTest
    static void testUpsertDoesNotDuplicate() {
        SFRoadmapController.saveProgress('{"beginner-core":["Topic A"]}');
        SFRoadmapController.saveProgress('{"beginner-core":["Topic A","Topic B"]}');

        List<SF_Roadmap_Progress__c> recs = [
            SELECT Id FROM SF_Roadmap_Progress__c
            WHERE User__c = :UserInfo.getUserId()
        ];
        System.assertEquals(1, recs.size(), 'Only one record per user should exist');
    }

    @isTest
    static void testResetProgress() {
        SFRoadmapController.saveProgress('{"beginner-core":["Topic A"]}');
        SFRoadmapController.resetProgress();

        String result = SFRoadmapController.loadProgress();
        System.assertEquals('{}', result, 'Progress should be empty after reset');
    }
}