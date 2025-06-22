import { useState } from 'react';
import { Platform } from 'react-native';
import { YStack, XStack, Text, Input, Button, useTheme, ScrollView } from 'tamagui';
import { Tag, Plus, X } from 'lucide-react-native';
import useTimerStore from '~/store/timerStore';
import * as Haptics from 'expo-haptics';

interface TagSelectorProps {
  onTagSelected: () => void;
  onCancel: () => void;
}

export default function TagSelector({ onTagSelected, onCancel }: TagSelectorProps) {
  const { setCurrentTag, recentTags } = useTimerStore();
  const [newTag, setNewTag] = useState('');
  const theme = useTheme();

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const handleSelectTag = (tag: string) => {
    triggerHaptic();
    setCurrentTag(tag);
    onTagSelected();
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      triggerHaptic();
      setCurrentTag(newTag.trim());
      onTagSelected();
    }
  };

  return (
    <YStack bg="$background" p="$5" borderRadius={16} gap="$2" width="100%">
      {/* Header */}
      <YStack ai="center" mb="$3">
        <Text fontSize={20} fontWeight="600" color="$color" mb="$2">
          What are you studying?
        </Text>
        <Text fontSize={16} color="$gray10" textAlign="center">
          Add a tag to track your study subjects
        </Text>
      </YStack>

      {/* Input */}
      <XStack ai="center" bg="$gray4" borderRadius={12} px="$4" py="$3" mb="$3" gap="$1">
        <Tag size={20} color={theme.gray10?.val ?? '#888'} />
        <Input
          flex={1}
          fontSize={16}
          color="$color"
          placeholder="Enter subject (e.g., Math, Physics)"
          value={newTag}
          onChangeText={setNewTag}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={handleAddNewTag}
          borderWidth={0}
          bg="transparent"
        />
      </XStack>

      {/* Add Button */}
      <Button
        bg="$blue10"
        color="$background"
        borderRadius={12}
        gap="$2"
        mb="$2"
        onPress={handleAddNewTag}
        disabled={!newTag.trim()}
        icon={<Plus size={20} color={theme.background?.val ?? '#FFF'} />}>
        <Text color="$background" fontSize={16} fontWeight="600">
          Add & Start
        </Text>
      </Button>

      {/* Recent Tags */}
      {recentTags.length > 0 && (
        <YStack mb="$4">
          <Text fontSize={16} fontWeight="600" color="$gray10" mb="$3">
            Recent Subjects
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2">
              {recentTags.map((item) => (
                <Button
                  elevation={1}
                  key={item}
                  bg="$gray4"
                  borderRadius={20}
                  px="$4"
                  py="$2"
                  ai="center"
                  gap="$2"
                  onPress={() => handleSelectTag(item)}
                  icon={<Tag size={16} color={theme.blue10?.val ?? '#007aff'} />}
                  chromeless>
                  <Text fontSize={14} color="$color" fontWeight="500">
                    {item}
                  </Text>
                </Button>
              ))}
            </XStack>
          </ScrollView>
        </YStack>
      )}

      {/* Cancel Button */}
      <Button chromeless ai="center" jc="center" gap="$2" onPress={onCancel}>
        <X size={20} color={theme.gray10?.val ?? '#888'} />
        <Text fontSize={16} color="$gray10" fontWeight="500">
          Cancel
        </Text>
      </Button>
    </YStack>
  );
}
