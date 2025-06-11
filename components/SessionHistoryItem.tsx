import { YStack, XStack, Text, useTheme } from 'tamagui';
import { StudySession } from '~/types/timer';
import { CheckCircle, XCircle, Clock, Tag } from 'lucide-react-native';

interface SessionHistoryItemProps {
  session: StudySession;
  isToday?: boolean;
}

export default function SessionHistoryItem({ session, isToday = false }: SessionHistoryItemProps) {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) {
      return `${mins} min`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
    }
  };

  return (
    <XStack
      p="$4"
      bg="$gray3"
      borderRadius={12}
      mb="$3"
      ai="center"
      borderLeftWidth={isToday ? 3 : 0}
      borderLeftColor="$blue10">
      <XStack mr="$3">
        {session.completed ? (
          <CheckCircle color={theme.green10.val} size={24} />
        ) : (
          <XCircle color={theme.red10.val} size={24} />
        )}
      </XStack>

      <YStack f={1}>
        <Text color="$color" fontSize={16} fontWeight="600" mb="$1">
          {isToday ? 'Today' : formatDate(session.date)}
        </Text>

        <XStack ai="center" mb="$1">
          <XStack ai="center" mr="$3">
            <Clock size={14} color={theme.gray10.val} />
            <Text color="$gray10" fontSize={14} ml="$1">
              {formatTime(session.date)}
            </Text>
          </XStack>
          <Text color="$gray10" fontSize={14} fontWeight="500">
            {formatDuration(session.duration)}
          </Text>
        </XStack>

        {session.tag && (
          <XStack ai="center">
            <Tag size={14} color={theme.blue10.val} />
            <Text color="$blue10" fontSize={14} fontWeight="500" ml="$1">
              {session.tag}
            </Text>
          </XStack>
        )}
      </YStack>

      <XStack px="$2.5" py="$1" borderRadius={12}>
        <Text fontSize={14} fontWeight="600" color={session.completed ? '$green10' : '$red10'}>
          {session.completed ? 'Completed' : 'Stopped'}
        </Text>
      </XStack>
    </XStack>
  );
}
