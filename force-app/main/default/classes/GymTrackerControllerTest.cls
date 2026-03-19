// force-app/main/default/classes/GymTrackerControllerTest.cls
@isTest
private class GymTrackerControllerTest {

    @testSetup
    static void setup() {
        Gym_Log__c log = new Gym_Log__c(
            Log_Date__c     = Date.today(),
            Duration__c     = 60,
            Workout_Type__c = 'Strength',
            Mood__c         = 'Good',
            Comments__c     = 'Test session',
            User__c         = UserInfo.getUserId()
        );
        insert log;
    }

    @isTest static void testGetLogs() {
        List<Gym_Log__c> logs = GymTrackerController.getLogs();
        System.assert(!logs.isEmpty(), 'Should return at least one log');
    }

    @isTest static void testSaveLog() {
        Gym_Log__c saved = GymTrackerController.saveLog(
            String.valueOf(Date.today().addDays(-1)),
            45, 'Cardio', 'Beast', 'Great run today'
        );
        System.assertNotEquals(null, saved.Id, 'Record should be inserted');
    }

    @isTest static void testDeleteLog() {
        List<Gym_Log__c> logs = [SELECT Id FROM Gym_Log__c LIMIT 1];
        GymTrackerController.deleteLog(logs[0].Id);
        Integer count = [SELECT COUNT() FROM Gym_Log__c WHERE Id = :logs[0].Id];
        System.assertEquals(0, count, 'Record should be deleted');
    }

    @isTest static void testGetMiniStats() {
        Map<String, Object> stats = GymTrackerController.getMiniStats();
        System.assert(stats.containsKey('totalSessions'), 'Should have totalSessions');
        System.assert(stats.containsKey('totalHours'),    'Should have totalHours');
        System.assert(stats.containsKey('currentStreak'), 'Should have currentStreak');
    }
}