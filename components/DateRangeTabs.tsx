import { XStack, Button, Text } from 'tamagui';

export function DateRangeTabs({
  selected,
  setSelected,
}: {
  selected: 'today' | 'till_date';
  setSelected: (val: 'today' | 'till_date') => void;
}) {
  return (
    <XStack bg="$gray4" br={8} mb="$2">
      <Button
        f={1}
        size="$2"
        bg={selected === 'today' ? '$gray6' : 'transparent'}
        br={8}
        onPress={() => setSelected('today')}>
        <Text
          color={selected === 'today' ? '$color' : '$gray10'}
          fontFamily="$mono"
          fontWeight="400">
          Today
        </Text>
      </Button>

      <Button
        f={1}
        size="$2"
        bg={selected === 'till_date' ? '$gray6' : 'transparent'}
        br={8}
        onPress={() => setSelected('till_date')}>
        <Text
          color={selected === 'till_date' ? '$color' : '$gray10'}
          fontFamily="$mono"
          fontWeight="400">
          All
        </Text>
      </Button>
    </XStack>
  );
}
