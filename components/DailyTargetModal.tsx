import { Modal } from 'react-native';
import { YStack, View } from 'tamagui';
import DailyTargetSetter from './DailyTargetSetter';

interface DailyTargetModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DailyTargetModal({ visible, onClose }: DailyTargetModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <YStack
        f={1}
        jc="center"
        ai="center"
        bg="rgba(0,0,0,0.5)"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}>
        <View
          bg="$background"
          borderRadius={20}
          width="85%"
          maxWidth={400}
          overflow="hidden"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={4}>
          <DailyTargetSetter onClose={onClose} />
        </View>
      </YStack>
    </Modal>
  );
}
