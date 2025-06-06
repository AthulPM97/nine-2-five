import * as Notifications from 'expo-notifications';

export async function scheduleSessionCompleteNotification(seconds: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Session Complete!',
      body: 'Your study session has finished.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
    },
  });
}
