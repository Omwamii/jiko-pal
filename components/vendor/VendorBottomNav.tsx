import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabKey = 'home' | 'orders' | 'monitors' | 'profile' | 'help';

const PRIMARY_COLOR = '#3629B7';

const tabs: Array<{ key: TabKey; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
  { key: 'home', label: 'Home', icon: 'home-outline' },
  { key: 'orders', label: 'Orders', icon: 'swap-horizontal' },
  { key: 'monitors', label: 'Monitors', icon: 'gas-cylinder' },
  { key: 'profile', label: 'Profile', icon: 'account-outline' },
  { key: 'help', label: 'Help', icon: 'headset' },
];

export function VendorBottomNav({ active }: { active: TabKey }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onPress = (key: TabKey) => {
    if (key === 'home') {
      router.push('/vendor-dashboard' as Href);
      return;
    }

    if (key === 'orders') {
      router.push('/vendor-orders' as Href);
      return;
    }

    if (key === 'monitors') {
      router.push('/vendor-subscribers' as Href);
      return;
    }

    if (key === 'profile') {
      router.push('/vendor-settings' as Href);
      return;
    }

    if (key === 'help') {
      router.push('/vendor-help' as Href);
    }
  };

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;

        return (
          <TouchableOpacity key={tab.key} style={styles.bottomItem} activeOpacity={0.8} onPress={() => onPress(tab.key)}>
            <MaterialCommunityIcons name={tab.icon} size={18} color={isActive ? PRIMARY_COLOR : '#8E8AA8'} />
            <Text style={[styles.bottomLabel, isActive && styles.bottomLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ECECF3',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  bottomLabel: {
    color: '#8E8AA8',
    fontSize: 10,
    fontWeight: '500',
  },
  bottomLabelActive: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
});
