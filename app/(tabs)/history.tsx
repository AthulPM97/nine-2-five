import { View, StyleSheet, FlatList, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '~/constants/colors';
import SessionHistoryItem from '~/components/SessionHistoryItem';
import useTimerStore from '~/store/timerStore';
import { Clock } from 'lucide-react-native';

export default function HistoryScreen() {
  const { sessions } = useTimerStore();

  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate total study time
  const totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0);

  // Format total study time
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} minutes`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Study Time</Text>
          <View style={styles.statValueContainer}>
            <Clock size={20} color={Colors.light.primary} />
            <Text style={styles.statValue}>{formatTotalTime(totalStudyTime)}</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={[styles.statCard, styles.smallStatCard]}>
            <Text style={styles.statTitle}>Sessions</Text>
            <Text style={styles.statValue}>{sessions.length}</Text>
          </View>

          <View style={[styles.statCard, styles.smallStatCard]}>
            <Text style={styles.statTitle}>Completed</Text>
            <Text style={[styles.statValue, { color: Colors.light.success }]}>
              {sessions.filter((s) => s.completed).length}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Session History</Text>

        {sortedSessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No study sessions yet</Text>
            <Text style={styles.emptySubtext}>
              Complete your first study session to see it here
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SessionHistoryItem session={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.light.lightGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  smallStatCard: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  historyContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: Colors.light.text,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.darkGray,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.darkGray,
    textAlign: 'center',
  },
});
