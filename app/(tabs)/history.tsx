import { useState } from 'react';
import { FlatList } from 'react-native';

import { Clock, Tag, BarChart } from 'lucide-react-native';
import { YStack, XStack, Text, Button, useTheme } from 'tamagui';

import SessionHistoryItem from '~/components/SessionHistoryItem';
import TagStatsChart from '~/components/TagStatsChart';

import { getTodayDateString, isToday } from '~/utils/dateUtils';
import { getLast7DaysTotalSeconds } from '~/utils/historyUtils';
import { formatTotalTime } from '~/utils/formatTime';
import useTimerStore from '~/store/timerStore';

export default function HistoryScreen() {
  const { sessions, dailyProgress, getTagStats } = useTimerStore();
  const [activeTab, setActiveTab] = useState<'sessions' | 'subjects'>('sessions');
  const theme = useTheme();

  const totalSeconds = getLast7DaysTotalSeconds(dailyProgress);
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const tagStats = getTagStats();
  const today = getTodayDateString();
  const todaySessions = sessions.filter((session) => session.date.split('T')[0] === today);
  const totalStudyTime = todaySessions.reduce((total, session) => total + session.duration, 0);

  return (
    <YStack f={1} bg="$background" p="$4">
      <YStack mb="$6">
        {/* Total Study Time Card */}
        <YStack bg="$gray4" br={16} p="$4" mb="$3">
          <Text color="$gray10" fontSize={14} mb="$2">
            Total Study Time Today
          </Text>
          <XStack ai="center" gap="$2">
            <Clock size={20} color={theme.blue10.val} />
            <Text color="$color" fontSize={20} fontWeight="600">
              {formatTotalTime(totalStudyTime)}
            </Text>
          </XStack>
        </YStack>

        {/* Stats Row */}
        <XStack gap="$3" mb="$3">
          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontSize={14} mb="$2">
              Sessions Today
            </Text>
            <Text color="$color" fontSize={20} fontWeight="600">
              {todaySessions.length}
            </Text>
          </YStack>

          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontSize={14} mb="$2">
              Total Subjects
            </Text>
            <Text color="$blue10" fontSize={20} fontWeight="600">
              {tagStats.length}
            </Text>
          </YStack>
        </XStack>

        {/* Summary Card */}
        <YStack bg="$gray4" br={16} p="$4" ai="center">
          <Text color="$gray10" fontSize={14} fontWeight="500" mb="$1">
            Last 7 days, you spent
          </Text>
          <Text color="$color" fontSize={24} fontWeight="bold">
            {Math.floor(totalSeconds / 3600)} hours {Math.floor((totalSeconds % 3600) / 60)} minutes
          </Text>
        </YStack>
      </YStack>

      {/* Tab Selector */}
      <XStack bg="$gray4" br={12} mb="$5" p="$1">
        <Button
          f={1}
          bg={activeTab === 'sessions' ? '$gray6' : 'transparent'}
          br={8}
          onPress={() => setActiveTab('sessions')}
          icon={
            <Clock
              size={18}
              color={activeTab === 'sessions' ? theme.blue10.val : theme.gray10.val}
            />
          }>
          <Text color={activeTab === 'sessions' ? '$color' : '$gray10'} fontWeight="500">
            Sessions
          </Text>
        </Button>

        <Button
          f={1}
          bg={activeTab === 'subjects' ? '$gray6' : 'transparent'}
          br={8}
          onPress={() => setActiveTab('subjects')}
          icon={
            <Tag size={18} color={activeTab === 'subjects' ? theme.blue10.val : theme.gray10.val} />
          }>
          <Text color={activeTab === 'subjects' ? '$color' : '$gray10'} fontWeight="500">
            Subjects
          </Text>
        </Button>
      </XStack>

      {activeTab === 'sessions' ? (
        <YStack f={1}>
          <Text color="$color" fontSize={18} fontWeight="600" mb="$4">
            Session History
          </Text>

          {sortedSessions.length === 0 ? (
            <YStack f={1} jc="center" ai="center" mt="$6">
              <Text color="$gray10" fontSize={18} fontWeight="600" mb="$2">
                No study sessions yet
              </Text>
              <Text color="$gray10" fontSize={14} ta="center">
                Complete your first study session to see it here
              </Text>
            </YStack>
          ) : (
            <FlatList
              data={sortedSessions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SessionHistoryItem session={item} isToday={isToday(item.date.split('T')[0])} />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </YStack>
      ) : (
        <YStack f={1}>
          <XStack jc="space-between" ai="center" mb="$4">
            <Text color="$color" fontSize={18} fontWeight="600">
              Subject Breakdown
            </Text>
            <BarChart size={20} color={theme.gray10.val} />
          </XStack>

          <TagStatsChart tagStats={tagStats} />
        </YStack>
      )}
    </YStack>
  );
}
