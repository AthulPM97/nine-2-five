import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import useTimerStore from '~/store/timerStore';
// import Colors from '~/constants/colors'; // No longer needed
import { View } from 'tamagui'; // Make sure this is a Tamagui View
import { Download } from 'lucide-react-native';
import useColorSchemeStore from '~/store/colorSchemeStore';
import { useTheme } from 'tamagui'; // Import useTheme from Tamagui

export default function Modal() {
  const { exportData } = useTimerStore();
  const { colorScheme, toggleColorScheme } = useColorSchemeStore();
  const theme = useTheme(); // Get the current Tamagui theme object

  // Download/export handler
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
    <View style={styles.container}>
      {/* The `Download` icon can now get its color from the theme directly */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary.get() }]} // Access theme values
        onPress={handleExportData}>
        <View style={styles.buttonContainer}>
          <Download color={theme.color.get()} /> {/* Use theme.color for icon */}
          <Text style={[styles.buttonText, { color: theme.color.get() }]}>Save your data</Text>
        </View>
      </TouchableOpacity>

      {/* Dark mode toggle */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary.get() }]}
        onPress={toggleColorScheme}>
        <Text style={[styles.buttonText, { color: theme.color.get() }]}>
          {colorScheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Keep your StyleSheet.create for static styles or those not handled by Tamagui directly
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});