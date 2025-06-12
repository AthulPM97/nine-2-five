import { Modal } from 'react-native';
import { YStack, Text, Button, useTheme } from 'tamagui';
import { CheckCircle } from 'lucide-react-native';

interface SessionCompleteModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SessionCompleteModal({ visible, onClose }: SessionCompleteModalProps) {
  const theme = useTheme();
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
        <YStack
          bg="$background"
          borderRadius={20}
          p="$6"
          ai="center"
          width="85%"
          maxWidth={400}
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.25}
          shadowRadius={4}
          elevation={5}>
          <CheckCircle color={theme.green10?.val ?? '#22c55e'} size={60} />
          <Text mt="$3" fontSize={24} fontWeight="600" color="$color" mb="$2">
            Session Complete!
          </Text>
          <Text mb="$4" textAlign="center" fontSize={16} color="$gray10">
            Good job! Take a short break before starting next session.
          </Text>
          <Button
            bg="$blue10"
            color="$color"
            borderRadius={12}
            px="$6"
            fontWeight="600"
            fontSize={16}
            onPress={onClose}
            minWidth={120}>
            Close
          </Button>
        </YStack>
      </YStack>
    </Modal>
  );
}
