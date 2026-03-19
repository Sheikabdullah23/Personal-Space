/**
 * ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
 * Class Name      : GymTrackerController
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

public class GymTrackerController {

	// ── Fetch all logs for running user ──────────────────────
    @AuraEnabled(cacheable=true)
    public static List<Gym_Log__c> getLogs() {
        return [
            SELECT Id, Name, Log_Date__c, Duration__c,
                   Workout_Type__c, Mood__c, Comments__c
            FROM   Gym_Log__c
            WHERE  User__c = :UserInfo.getUserId()
            ORDER  BY Log_Date__c DESC
        ];
    }

    // ── Save a new log ───────────────────────────────────────
    @AuraEnabled
    public static Gym_Log__c saveLog(
        String  logDate,
        Integer duration,
        String  workoutType,
        String  mood,
        String  comments
    ) {
        Gym_Log__c log = new Gym_Log__c(
            Log_Date__c    = Date.valueOf(logDate),
            Duration__c    = duration,
            Workout_Type__c = workoutType,
            Mood__c        = mood,
            Comments__c    = comments,
            User__c        = UserInfo.getUserId()
        );
        insert log;
        return log;
    }

    // ── Delete a log ─────────────────────────────────────────
    @AuraEnabled
    public static void deleteLog(String recordId) {
        delete [
            SELECT Id FROM Gym_Log__c
            WHERE Id = :recordId
            AND   User__c = :UserInfo.getUserId()
            LIMIT 1
        ];
    }

    // ── Mini stats for roadmap card ──────────────────────────
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getMiniStats() {
        List<Gym_Log__c> logs = [
            SELECT Log_Date__c, Duration__c
            FROM   Gym_Log__c
            WHERE  User__c = :UserInfo.getUserId()
            ORDER  BY Log_Date__c ASC
        ];

        Integer totalSessions = logs.size();
        Decimal totalMins     = 0;
        for (Gym_Log__c l : logs) {
            totalMins += (l.Duration__c != null ? l.Duration__c : 0);
        }

        // Current streak (consecutive days up to today)
        Integer streak = 0;
        if (!logs.isEmpty()) {
            Date today    = Date.today();
            Date expected = today;
            // Walk backwards through sorted desc list
            List<Gym_Log__c> desct = new List<Gym_Log__c>();
            for (Integer i = logs.size() - 1; i >= 0; i--) desct.add(logs[i]);
            for (Gym_Log__c l : desct) {
                if (l.Log_Date__c == expected || l.Log_Date__c == expected.addDays(-1)) {
                    streak++;
                    expected = l.Log_Date__c.addDays(-1);
                } else {
                    break;
                }
            }
        }

        Map<String, Object> stats = new Map<String, Object>();
        stats.put('totalSessions', totalSessions);
        stats.put('totalHours',    (totalMins / 60).setScale(1));
        stats.put('currentStreak', streak);
        return stats;}

}