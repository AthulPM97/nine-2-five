import { YStack, Text, useTheme } from 'tamagui';
import { Svg, Circle } from 'react-native-svg';

interface TimerDisplayProps {
  timeRemaining: number;
  duration: number;
  isBackgroundMode?: boolean;
}

export default function TimerDisplay({
  timeRemaining,
  duration,
  isBackgroundMode = false,
}: TimerDisplayProps) {
  const theme = useTheme();

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress for the circle
  const progress = 1 - timeRemaining / duration;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  // Theme-safe colors
  const gray = theme.gray6?.val ?? '#ccc';
  const primary = theme.blue10?.val ?? '#007aff';
  const secondary = theme.blue8?.val ?? '#5dade2';
  const textColor = theme.color?.val ?? '#222';
  const secondaryColor = theme.blue8?.val ?? '#5dade2';
  const labelColor = theme.gray10?.val ?? '#888';

  return (
    <YStack ai="center" jc="center" position="relative" width={280} height={120}>
      <Svg width={280} height={280} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle cx="140" cy="140" r={radius} stroke={gray} strokeWidth="12" fill="transparent" />
        {/* Progress circle */}
        <Circle
          cx="140"
          cy="140"
          r={radius}
          stroke={isBackgroundMode ? secondary : primary}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform="rotate(-90, 140, 140)"
        />
      </Svg>
      <YStack ai="center" jc="center" f={1} width="100%" height="100%">
        <Text
          fontSize={56}
          fontFamily="$mono"
          fontWeight="300"
          color={isBackgroundMode ? secondaryColor : textColor}>
          {formatTime(timeRemaining)}
        </Text>
        <Text fontSize={16} fontFamily="$mono" color={labelColor} mt="$2">
          {timeRemaining === 0
            ? "Time's up!"
            : isBackgroundMode
              ? 'running in background'
              : 'remaining'}
        </Text>
      </YStack>
    </YStack>
  );
}
