import { YStack, XStack, Text, ScrollView, View } from 'tamagui';
import useTimerStore from '~/store/timerStore';
import { TagStats } from '~/types/timer';
import { getTodayDateString } from '~/utils/dateUtils';

interface TagStatsChartProps {
  selected: 'today' | 'till_date';
}

export default function TagStatsChart({ selected }: TagStatsChartProps) {
  const { sessions, getTagStats } = useTimerStore();
  const today = getTodayDateString();

  // Get stats based on selected range
  const tagStats: TagStats[] =
    selected === 'today'
      ? getTagStatsForSessions(sessions.filter((session) => session.date.split('T')[0] === today))
      : getTagStats();

  if (tagStats.length === 0) {
    return (
      <YStack f={1} jc="center" ai="center" p="$5">
        <Text color="$gray10" fontSize={16} ta="center">
          No subject data {selected === 'today' ? 'for today' : 'yet'}
        </Text>
      </YStack>
    );
  }

  // Get stats for specific sessions
  function getTagStatsForSessions(filteredSessions: typeof sessions): TagStats[] {
    const tagMap = new Map<string, { totalSeconds: number; sessionCount: number }>();

    filteredSessions.forEach((session) => {
      const tag = session.tag || 'Untagged';
      const current = tagMap.get(tag) || { totalSeconds: 0, sessionCount: 0 };
      tagMap.set(tag, {
        totalSeconds: current.totalSeconds + session.duration,
        sessionCount: current.sessionCount + 1,
      });
    });

    return Array.from(tagMap.entries())
      .map(([tag, stats]) => ({
        tag,
        totalSeconds: stats.totalSeconds,
        sessionCount: stats.sessionCount,
      }))
      .sort((a, b) => b.totalSeconds - a.totalSeconds);
  }

  // Find the tag with the most time (for calculating relative bar widths)
  const maxSeconds = Math.max(...tagStats.map((stat) => stat.totalSeconds));

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <ScrollView f={1} showsVerticalScrollIndicator={false}>
      {tagStats.map((stat, index) => (
        <YStack key={stat.tag} mb="$4">
          <XStack jc="space-between" ai="center" mb="$2">
            <Text color="$color" fontFamily="$mono" fontSize={16} fontWeight="600">
              {stat.tag}
            </Text>
            <Text color="$gray10" fontFamily="$mono" fontSize={14}>
              {stat.sessionCount} session{stat.sessionCount !== 1 ? 's' : ''}
            </Text>
          </XStack>

          <XStack ai="center" height={24}>
            <View
              f={1}
              mr="$2"
              position="relative"
              height="100%"
              overflow="hidden"
              borderRadius={4}>
              <View
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                bg={index === 0 ? '$blue10' : '$blue8'}
                width={`${(stat.totalSeconds / maxSeconds) * 100}%`}
                borderRadius={4}
              />
            </View>
            <Text color="$gray10" fontFamily="$mono" fontSize={14} fontWeight="500">
              {formatTime(stat.totalSeconds)}
            </Text>
          </XStack>
        </YStack>
      ))}
    </ScrollView>
  );
}
