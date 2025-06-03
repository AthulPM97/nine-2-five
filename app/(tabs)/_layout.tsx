import { Tabs, Link } from 'expo-router';
import Colors from '~/constants/colors';
import { Clock, BarChart } from 'lucide-react-native';
import { HeaderButton } from '~/components/HeaderButton';
import useColorSchemeStore from '~/store/colorSchemeStore';

export default function TabLayout() {
  const { colorScheme } = useColorSchemeStore();

  const screenOptions = {
    tabBarActiveTintColor: Colors[colorScheme].primary,
    tabBarInactiveTintColor: Colors[colorScheme].darkGray,
    tabBarStyle: {
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme].gray,
    },
    headerStyle: {
      backgroundColor: Colors[colorScheme].background,
    },
    headerTintColor: Colors[colorScheme].text,
  };
  return (
    <Tabs
      screenOptions={{
        ...screenOptions,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Study Timer',
          tabBarIcon: ({ color }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
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
