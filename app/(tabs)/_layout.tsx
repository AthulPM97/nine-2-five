import { Tabs, Link } from 'expo-router';
import { Clock, BarChart } from 'lucide-react-native';
import { HeaderButton } from '~/components/HeaderButton';
import { useTheme } from 'tamagui';

export default function TabLayout() {
  const theme = useTheme();

  // Use Tamagui tokens for colors
  const tabBarActiveTintColor = theme.blue10.val;
  const tabBarInactiveTintColor = theme.gray10.val;
  const tabBarBorderColor = theme.gray5.val;
  const headerBg = theme.background?.val ?? '#fff';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: tabBarBorderColor,
          backgroundColor: headerBg,
        },
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTintColor: theme.color?.val,
          tabBarIcon: ({ color }) => <BarChart size={24} color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
