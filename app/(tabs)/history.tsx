import { useState } from 'react';
import { FlatList } from 'react-native';

import { Clock, Tag } from 'lucide-react-native';
import { YStack, XStack, Text, Button, useTheme } from 'tamagui';

import SessionHistoryItem from '~/components/SessionHistoryItem';
import TagStatsChart from '~/components/TagStatsChart';

import { getTodayDateString, getYesterdayString, isToday } from '~/utils/dateUtils';
import { getLast7DaysTotalSeconds } from '~/utils/historyUtils';
import { formatTotalTime } from '~/utils/formatTime';
import useTimerStore from '~/store/timerStore';
import { DateRangeTabs } from '~/components/DateRangeTabs';

export default function HistoryScreen() {
  const { sessions, dailyProgress } = useTimerStore();
  const [activeTab, setActiveTab] = useState<'sessions' | 'subjects'>('sessions');
  const [range, setRange] = useState<'today' | 'till_date'>('today');
  const theme = useTheme();

  const totalSeconds = getLast7DaysTotalSeconds(dailyProgress);
  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const today = getTodayDateString();
  const todaySessions = sessions.filter((session) => session.date.split('T')[0] === today);
  const totalStudyTime = todaySessions.reduce((total, session) => total + session.duration, 0);

  // yesterday study time
  const yesterdayString = getYesterdayString();
  const yesterdaySessions = sessions.filter(
    (session) => session.date.split('T')[0] === yesterdayString
  );
  const yesterdayStudyTime = yesterdaySessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  return (
    <YStack f={1} bg="$background" p="$4">
      <YStack mb="$6">
        {/* Stats Row */}
        <XStack gap="$3" mb="$3">
          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontFamily="$mono" fontSize={14} mb="$2">
              Sessions Today
            </Text>
            <Text color="$color" fontFamily="$mono" fontSize={20} fontWeight="600">
              {todaySessions.length}
            </Text>
          </YStack>

          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontFamily="$mono" fontSize={14} mb="$2">
              Study Time Today
            </Text>
            <Text color="$blue10" fontFamily="$mono" fontSize={20} fontWeight="600">
              {formatTotalTime(totalStudyTime)}
            </Text>
          </YStack>
        </XStack>
        <XStack gap="$3" mb="$3">
          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontFamily="$mono" fontSize={14} mb="$2">
              Yesterday
            </Text>
            <Text color="$color" fontFamily="$mono" fontSize={20} fontWeight="600">
              {formatTotalTime(yesterdayStudyTime)}
            </Text>
          </YStack>
          <YStack f={1} bg="$gray4" br={16} p="$4">
            <Text color="$gray10" fontFamily="$mono" fontSize={14} mb="$2">
              Last 7 days
            </Text>
            <Text color="$color" fontFamily="$mono" fontSize={20} fontWeight="600">
              {formatTotalTime(totalSeconds)}
            </Text>
          </YStack>
        </XStack>
      </YStack>

      {/* Tab Selector */}
      <XStack bg="$gray4" br={12} mb="$5" p="$1">
        <Button
          f={1}
          bg={activeTab === 'sessions' ? '$gray6' : 'transparent'}
          br={8}
          onPress={() => {
            setActiveTab('sessions');
            setRange('today');
            return;
          }}
          icon={
            <Clock
              size={18}
              color={activeTab === 'sessions' ? theme.blue10.val : theme.gray10.val}
            />
          }>
          <Text
            color={activeTab === 'sessions' ? '$color' : '$gray10'}
            fontFamily="$mono"
            fontWeight="500">
            Sessions
          </Text>
        </Button>

        <Button
          f={1}
          bg={activeTab === 'subjects' ? '$gray6' : 'transparent'}
          br={8}
          onPress={() => {
            setActiveTab('subjects');
            setRange('today');
            return;
          }}
          icon={
            <Tag size={18} color={activeTab === 'subjects' ? theme.blue10.val : theme.gray10.val} />
          }>
          <Text
            color={activeTab === 'subjects' ? '$color' : '$gray10'}
            fontFamily="$mono"
            fontWeight="500">
            Subjects
          </Text>
        </Button>
      </XStack>

      {activeTab === 'sessions' ? (
        <YStack f={1}>
          <XStack>
            <YStack f={1}>
              <Text color="$color" fontFamily="$mono" fontSize={18} fontWeight="600" mb="$4"></Text>
            </YStack>
            <YStack f={1}>
              <DateRangeTabs selected={range} setSelected={setRange} />
            </YStack>
          </XStack>

          {(range === 'today' ? todaySessions.length === 0 : sortedSessions.length === 0) ? (
            <YStack f={1} jc="center" ai="center">
              <Text color="$gray10" fontFamily="$mono" fontSize={18} fontWeight="600" mb="$2">
                No study sessions {range === 'today' ? 'today' : 'yet'}
              </Text>
              <Text color="$gray10" fontFamily="$mono" fontSize={14} ta="center">
                {range === 'today'
                  ? 'Complete your first session today to see it here'
                  : 'Complete your first study session to see it here'}
              </Text>
            </YStack>
          ) : (
            <FlatList
              data={range === 'today' ? todaySessions : sortedSessions}
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
          <XStack>
            <YStack f={1}></YStack>
            <YStack f={1}>
              <DateRangeTabs selected={range} setSelected={setRange} />
            </YStack>
          </XStack>

          <TagStatsChart selected={range} />
        </YStack>
      )}
    </YStack>
  );
}
