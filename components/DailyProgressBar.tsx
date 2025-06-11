import { YStack, XStack, Text, View } from 'tamagui';

interface DailyProgressBarProps {
  currentSeconds: number;
  targetSeconds: number;
}

export default function DailyProgressBar({ currentSeconds, targetSeconds }: DailyProgressBarProps) {
  // Calculate progress percentage (capped at 100%)
  const progressPercentage = Math.min(100, (currentSeconds / targetSeconds) * 100);

  // Format time remaining
  const formatTimeRemaining = (seconds: number) => {
    const remainingSeconds = Math.max(0, targetSeconds - seconds);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);

    if (hours === 0 && minutes === 0) {
      return 'Target reached!';
    }

    return `${hours}h ${minutes}m remaining`;
  };

  // Format current progress
  const formatProgress = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  };

  return (
    <YStack my="$2">
      <XStack jc="space-between" mb="$2">
        <Text fontSize={14} color="$color" fontWeight="500">
          {formatProgress(currentSeconds)} of {formatProgress(targetSeconds)}
        </Text>
        <Text fontSize={14} color="$gray10">
          {formatTimeRemaining(currentSeconds)}
        </Text>
      </XStack>
      <View height={10} bg="$gray4" borderRadius={5} overflow="hidden">
        <View
          height="100%"
          width={`${progressPercentage}%`}
          bg={progressPercentage >= 100 ? '$green10' : '$blue10'}
          borderRadius={5}
        />
      </View>
    </YStack>
  );
}
