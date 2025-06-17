import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { YStack, XStack, Button, Theme, Text, View } from 'tamagui';
import { Alert, Platform } from 'react-native';
import useColorSchemeStore from '~/store/colorSchemeStore';
import useTimerStore from '~/store/timerStore';
import { Download, Moon, Sun, ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'react-native';
import { useTheme } from 'tamagui';
import { useRouter } from 'expo-router';

export default function Modal() {
  const theme = useTheme();
  const router = useRouter();
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
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background.val}
        />

        <YStack f={1} bg="$background">
          {/* Header */}
          <XStack
            backgroundColor="$background"
            borderBottomColor="$gray4"
            borderBottomWidth={1}
            pl="$4"
            pr="$4"
            pb="$2"
            ai="center">
            <Button
              size="$3"
              circular
              chromeless
              onPress={() => router.back()}
              icon={<ArrowLeft size={24} color={theme.color?.val} />}
            />
            <Text flex={1} textAlign="center" fontSize={18} fontWeight="600" color="$color">
              Settings
            </Text>
            <View width={24} />
          </XStack>

          {/* Content */}
          <YStack p="$4" gap="$4">
            {/* Theme Section */}
            <YStack bg="$gray4" borderRadius={16} p="$4">
              <Text fontSize={16} fontWeight="600" color="$color" mb="$3">
                App Theme
              </Text>
              <Button
                bg="$background"
                borderColor="$gray6"
                borderWidth={1}
                borderRadius={12}
                p="$2"
                onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
                <XStack ai="center" jc="space-between" width="100%">
                  <XStack ai="center" gap="$2">
                    {colorScheme === 'dark' ? (
                      <Moon size={20} color={theme.color?.val} />
                    ) : (
                      <Sun size={20} color={theme.color?.val} />
                    )}
                    <Text fontSize={16} color="$color">
                      {colorScheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                  </XStack>
                  <Text fontSize={14} color="$gray10">
                    Tap to switch
                  </Text>
                </XStack>
              </Button>
            </YStack>

            {/* Data Export Section */}
            <YStack bg="$gray4" borderRadius={16} p="$4">
              <Text fontSize={16} fontWeight="600" color="$color" mb="$3">
                Data Management
              </Text>
              <Button
                bg="$background"
                borderColor="$gray6"
                borderWidth={1}
                borderRadius={12}
                p="$2"
                onPress={handleExportData}>
                <XStack ai="center" jc="space-between" width="100%">
                  <XStack ai="center" gap="$2">
                    <Download size={20} color={theme.blue10?.val} />
                    <Text fontSize={16} color="$color">
                      Export Study Data
                    </Text>
                  </XStack>
                  <Text fontSize={14} color="$gray10">
                    Save as JSON
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </Theme>
  );
}
