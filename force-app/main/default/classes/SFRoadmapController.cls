/**
 * ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
 * Class Name      : SFRoadmapController
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

public class SFRoadmapController {

	// ── Load progress for the running user ──────────────────────────────
    @AuraEnabled(cacheable=true)
    public static String loadProgress() {
        List<SF_Roadmap_Progress__c> records = [
            SELECT Progress_JSON__c
            FROM   SF_Roadmap_Progress__c
            WHERE  User__c = :UserInfo.getUserId()
            LIMIT  1
        ];
        return records.isEmpty() ? '{}' : records[0].Progress_JSON__c;
    }

    // ── Save / upsert progress for the running user ─────────────────────
    @AuraEnabled
    public static void saveProgress(String progressJson) {
        List<SF_Roadmap_Progress__c> records = [
            SELECT Id, Progress_JSON__c
            FROM   SF_Roadmap_Progress__c
            WHERE  User__c = :UserInfo.getUserId()
            LIMIT  1
        ];

        SF_Roadmap_Progress__c rec;
        if (records.isEmpty()) {
            rec = new SF_Roadmap_Progress__c(
                Name           = UserInfo.getName() + ' Roadmap',
                User__c        = UserInfo.getUserId(),
                Progress_JSON__c = progressJson
            );
        } else {
            rec = records[0];
            rec.Progress_JSON__c = progressJson;
        }
        upsert rec;
    }

    // ── Reset all progress for the running user ──────────────────────────
    @AuraEnabled
    public static void resetProgress() {
        List<SF_Roadmap_Progress__c> records = [
            SELECT Id
            FROM   SF_Roadmap_Progress__c
            WHERE  User__c = :UserInfo.getUserId()
            LIMIT  1
        ];
        if (!records.isEmpty()) {
            records[0].Progress_JSON__c = '{}';
            update records[0];
        }
    }
}