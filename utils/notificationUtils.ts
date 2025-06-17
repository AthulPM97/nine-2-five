import * as Notifications from 'expo-notifications';

export async function scheduleSessionCompleteNotification(seconds: number) {
  // Cancel any existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule the notification
  await Notifications.scheduleNotificationAsync({
    identifier: 'timer-complete',
    content: {
      title: 'Session Complete! 🎉',
      body: 'Great job! Your study session has finished.',
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: {
      channelId: 'timer-complete',
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: seconds,
      repeats: false,
    },
  });
}
