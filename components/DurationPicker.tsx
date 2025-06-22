import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { YStack, XStack, Button, Text } from 'tamagui';

interface DurationPickerProps {
  onSelectDuration: (duration: number) => void;
  selectedDuration: number;
}

const DURATIONS = [
  { label: '25m', value: 25 * 60 },
  { label: '45m', value: 45 * 60 },
  { label: '60m', value: 60 * 60 },
  { label: '90m', value: 90 * 60 },
  { label: '120m', value: 120 * 60 },
];

export default function DurationPicker({
  onSelectDuration,
  selectedDuration,
}: DurationPickerProps) {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  return (
    <YStack mb="$6" ai="center">
      <Text
        fontSize={16}
        fontFamily="$mono"
        fontWeight="600"
        color="$color"
        mb="$3"
        textAlign="center">
        Session Duration
      </Text>
      <XStack gap="$2" flexWrap="wrap" jc="center">
        {DURATIONS.map((duration) => {
          const isSelected = selectedDuration === duration.value;
          return (
            <Button
              key={duration.value}
              bg={isSelected ? '$blue10' : '$gray4'}
              color={isSelected ? '$background' : '$color'}
              borderRadius={20}
              minWidth={60}
              px="$2"
              py="$2"
              fontWeight="500"
              onPress={() => {
                triggerHaptic();
                onSelectDuration(duration.value);
              }}
              pressStyle={{
                bg: isSelected ? '$blue9' : '$gray4',
              }}>
              <Text
                fontSize={16}
                fontFamily="$mono"
                color={isSelected ? '$background' : '$color'}
                fontWeight="500">
                {duration.label}
              </Text>
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
}
