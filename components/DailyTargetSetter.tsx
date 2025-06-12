import { useState } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, Minus, Plus } from 'lucide-react-native';
import useTimerStore from '~/store/timerStore';
import { YStack, XStack, Button, Text, Input, useTheme } from 'tamagui';

interface DailyTargetSetterProps {
  onClose?: () => void;
}

export default function DailyTargetSetter({ onClose }: DailyTargetSetterProps) {
  const { dailyTarget, setDailyTarget } = useTimerStore();
  const theme = useTheme();

  // Convert seconds to hours for display
  const initialHours = Math.floor(dailyTarget / 3600);
  const [hours, setHours] = useState(initialHours.toString());

  const MIN_HOURS = 1;
  const MAX_HOURS = 9;

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const decreaseHours = () => {
    triggerHaptic();
    const currentHours = parseInt(hours);
    if (!isNaN(currentHours) && currentHours > MIN_HOURS) {
      setHours((currentHours - 1).toString());
    }
  };

  const increaseHours = () => {
    triggerHaptic();
    const currentHours = parseInt(hours);
    if (!isNaN(currentHours) && currentHours < MAX_HOURS) {
      setHours((currentHours + 1).toString());
    }
  };

  const handleInputChange = (text: string) => {
    // Only allow numbers
    if (/^\d*$/.test(text)) {
      setHours(text);
    }
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    let hoursValue = parseInt(hours);

    // Validate input
    if (isNaN(hoursValue)) {
      hoursValue = MIN_HOURS;
    } else {
      hoursValue = Math.max(MIN_HOURS, Math.min(hoursValue, MAX_HOURS));
    }

    setDailyTarget(hoursValue * 3600);
    if (onClose) onClose();
  };

  return (
    <YStack bg="$background" p="$5" borderRadius={16} ai="center" gap="$4" width="100%">
      <Text fontSize={20} fontWeight="600" color="$color" mb="$1">
        Set Your Target Hours
      </Text>

      <XStack ai="center" gap="$3" mb="$3">
        <Button
          size="$4"
          circular
          bg="$gray3"
          onPress={decreaseHours}
          disabled={parseInt(hours) <= MIN_HOURS}>
          <Minus
            size={20}
            color={parseInt(hours) <= MIN_HOURS ? theme.gray8?.val : theme.color?.val}
          />
        </Button>

        <XStack ai="center">
          <Input
            size="$5"
            fontSize={28}
            fontWeight="600"
            color="$color"
            textAlign="center"
            value={hours}
            onChangeText={handleInputChange}
            keyboardType="number-pad"
            maxLength={1}
            width={60}
            borderWidth={0}
            bg="transparent"
          />
          <Text fontSize={18} color="$gray10">
            hours
          </Text>
        </XStack>

        <Button
          size="$4"
          circular
          bg="$gray3"
          onPress={increaseHours}
          disabled={parseInt(hours) >= MAX_HOURS}>
          <Plus
            size={20}
            color={parseInt(hours) >= MAX_HOURS ? theme.gray8?.val : theme.color?.val}
          />
        </Button>
      </XStack>

      <Button
        bg="$blue10"
        color="$background"
        borderRadius={12}
        px="$5"
        fontWeight="600"
        fontSize={16}
        onPress={handleSave}
        icon={<Check size={20} color={theme.background?.val ?? '#FFF'} />}
        minWidth={140}>
        Save Target
      </Button>
    </YStack>
  );
}
