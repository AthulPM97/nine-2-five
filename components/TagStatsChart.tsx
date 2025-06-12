import { YStack, XStack, Text, ScrollView, View } from 'tamagui';
import { TagStats } from '~/types/timer';

interface TagStatsChartProps {
  tagStats: TagStats[];
}

export default function TagStatsChart({ tagStats }: TagStatsChartProps) {
  if (tagStats.length === 0) {
    return (
      <YStack f={1} jc="center" ai="center" p="$5">
        <Text color="$gray10" fontSize={16} ta="center">
          No subject data yet
        </Text>
      </YStack>
    );
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
            <Text color="$color" fontSize={16} fontWeight="600">
              {stat.tag}
            </Text>
            <Text color="$gray10" fontSize={14}>
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
            <Text color="$gray10" fontSize={14} fontWeight="500">
              {formatTime(stat.totalSeconds)}
            </Text>
          </XStack>
        </YStack>
      ))}
    </ScrollView>
  );
}
