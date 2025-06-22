import { XStack, YStack, Button, Text, useTheme } from 'tamagui';
import { Play, Pause, RotateCcw, Square } from 'lucide-react-native';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isBackgroundMode?: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onStop: () => void;
}

export default function TimerControls({
  isRunning,
  isPaused,
  isBackgroundMode = false,
  onStart,
  onPause,
  onResume,
  onReset,
  onStop,
}: TimerControlsProps) {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  const theme = useTheme();

  // Use Tamagui theme values for icon colors
  const iconColor = theme.color?.val ?? '#000';

  return (
    <YStack mt="$6" ai="center">
      {!isRunning && !isPaused ? (
        <Button
          bg="$blue10"
          color="$background"
          minWidth={120}
          borderRadius={12}
          onPress={() => {
            triggerHaptic();
            onStart();
          }}
          icon={<Play color={iconColor} size={20} />}>
          <Text color="$color" fontFamily="$mono" fontWeight="600" fontSize={16}>
            Start
          </Text>
        </Button>
      ) : (
        <XStack jc="center" gap="$4">
          {isRunning && !isBackgroundMode ? (
            <Button
              bg="$background"
              borderWidth={1}
              borderColor="$gray6"
              color="$color"
              borderRadius={12}
              gap="$2"
              onPress={() => {
                triggerHaptic();
                onPause();
              }}
              icon={<Pause color={iconColor} size={24} />}
            />
          ) : isPaused ? (
            <Button
              bg="$blue10"
              color="$color"
              borderRadius={12}
              gap="$2"
              onPress={() => {
                triggerHaptic();
                onResume();
              }}
              icon={<Play color={iconColor} size={24} />}
            />
          ) : null}

          <Button
            bg="$background"
            borderWidth={1}
            borderColor="$gray6"
            color="$color"
            borderRadius={12}
            gap="$2"
            onPress={() => {
              triggerHaptic();
              onReset();
            }}
            icon={<RotateCcw color={iconColor} size={24} />}
          />

          <Button
            bg="$red10"
            color="$background"
            borderRadius={12}
            gap="$2"
            onPress={() => {
              triggerHaptic();
              onStop();
            }}
            icon={<Square color={iconColor} size={24} />}
          />
        </XStack>
      )}
    </YStack>
  );
}
