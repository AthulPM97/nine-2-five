import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import useTimerStore from '~/store/timerStore';
import Colors from '~/constants/colors';
import { View } from 'tamagui';
import { Download } from 'lucide-react-native';

export default function Modal() {
  const { exportData } = useTimerStore();
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
      {/* <Text style={styles.title}>Download your data</Text> */}
      <TouchableOpacity style={styles.button} onPress={handleExportData}>
        <View style={styles.buttonContainer}>
          <Download />
          <Text style={styles.buttonText}>Save your data</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 12,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  title: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
