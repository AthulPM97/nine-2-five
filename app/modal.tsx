import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, Button, Theme, Text } from 'tamagui';
import { Alert, Platform } from 'react-native';
import useColorSchemeStore from '~/store/colorSchemeStore';
import useTimerStore from '~/store/timerStore';

export default function Modal() {
  const { exportData } = useTimerStore();

  const { colorScheme, setColorScheme } = useColorSchemeStore();

  const handleExportData = async () => {
    try {
      const json = await exportData();
      const fileName = `study-timer-export-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, json, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Export Study Data',
          });
        } else {
          Alert.alert('Sharing not available', 'Cannot share file on this device.');
        }
      } else {
        // Web fallback: download as blob
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      Alert.alert('Export failed', 'Could not export data: ' + (err as Error).message);
    }
  };

  return (
    <Theme name={colorScheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <YStack f={1} bg="$background" ai="center" p="$4" gap="$4">
          <Text color="$color" fontSize={20} fontWeight="bold">
            Settings
          </Text>
          <Button
            bg="$background"
            color="$color"
            borderWidth={1}
            borderColor="$primary"
            onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
            Switch to{colorScheme === 'dark' ? 'Light' : 'Dark'}Mode
          </Button>

          {/* Export Data Button */}
          <Button size="$3" color="$color" borderRadius="$4" onPress={handleExportData}>
            Save your data
          </Button>
        </YStack>
      </SafeAreaView>
    </Theme>
  );
}
