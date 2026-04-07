import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY_COLOR = '#3629B7';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        popToTopOnBlur: true,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 52 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vendors"
        options={{
          title: 'Vendors',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="headset" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="recent-activity"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
