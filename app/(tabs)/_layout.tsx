import { Tabs, Link } from 'expo-router';
import { Clock, BarChart } from 'lucide-react-native';
import { HeaderButton } from '~/components/HeaderButton';
import { useTheme } from 'tamagui';
import { StyleSheet } from 'react-native';
import useColorSchemeStore from '~/store/colorSchemeStore';

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    elevation: 0,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  tabBarItem: {
    paddingBottom: 6,
    paddingTop: 6,
  },
});

export default function TabLayout() {
  const theme = useTheme();
  const { colorScheme } = useColorSchemeStore();

  const tabBarActiveTintColor = theme.blue10.val;
  const tabBarInactiveTintColor = theme.gray10.val;
  const glassBackground = colorScheme === 'dark' ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.85)';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: glassBackground,
          borderTopWidth: 0,
          borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: theme.background.val,
        },
        headerTitleStyle: {
          fontFamily: 'mono',
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, focused }) => (
            <Clock size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerTintColor: theme.color?.val,
          tabBarIcon: ({ color, focused }) => (
            <BarChart size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
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
