import { Modal } from 'react-native';
import { YStack, View } from 'tamagui';
import TagSelector from './TagSelector';

interface TagSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onTagSelected: () => void;
}

export default function TagSelectorModal({
  visible,
  onClose,
  onTagSelected,
}: TagSelectorModalProps) {
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
          width="85%"
          maxWidth={400}
          bg="$background"
          borderRadius={20}
          overflow="hidden"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={4}>
          <TagSelector onTagSelected={onTagSelected} onCancel={onClose} />
        </View>
      </YStack>
    </Modal>
  );
}
