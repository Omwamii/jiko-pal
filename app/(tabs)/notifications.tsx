import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  day: 'today' | 'earlier';
  read: boolean;
  icon: 'alert' | 'check' | 'bell';
  accent: string;
  bg: string;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Low Gas Alert',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'today',
    read: false,
    icon: 'alert',
    accent: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    id: 'n2',
    title: 'Delivery Completed',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'today',
    read: false,
    icon: 'check',
    accent: '#10B981',
    bg: '#D1FAE5',
  },
  {
    id: 'n3',
    title: 'Order Confirmed',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'today',
    read: true,
    icon: 'bell',
    accent: '#6D5DD3',
    bg: '#EDE9FE',
  },
  {
    id: 'n4',
    title: 'Order Confirmed',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'today',
    read: true,
    icon: 'bell',
    accent: '#6D5DD3',
    bg: '#EDE9FE',
  },
  {
    id: 'n5',
    title: 'Critical Gas Level',
    description: 'Backup Cylinder is at 15%. Immediate refill recommended!',
    time: '1 day ago',
    day: 'earlier',
    read: false,
    icon: 'alert',
    accent: '#EF4444',
    bg: '#FEE2E2',
  },
  {
    id: 'n6',
    title: 'Order Confirmed',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'earlier',
    read: true,
    icon: 'bell',
    accent: '#6D5DD3',
    bg: '#EDE9FE',
  },
  {
    id: 'n7',
    title: 'Order Confirmed',
    description: 'Kitchen Gas is at 35%. Consider ordering a refill soon',
    time: '10 minutes ago',
    day: 'earlier',
    read: true,
    icon: 'bell',
    accent: '#6D5DD3',
    bg: '#EDE9FE',
  },
];

function NotificationIcon({ type, color }: { type: NotificationItem['icon']; color: string }) {
  if (type === 'alert') {
    return <MaterialCommunityIcons name="alert-circle-outline" size={14} color={color} />;
  }
  if (type === 'check') {
    return <MaterialCommunityIcons name="check-circle-outline" size={14} color={color} />;
  }
  return <MaterialCommunityIcons name="bell-outline" size={14} color={color} />;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const todayItems = useMemo(() => notifications.filter((item) => item.day === 'today'), [notifications]);
  const earlierItems = useMemo(() => notifications.filter((item) => item.day === 'earlier'), [notifications]);

  const markAllRead = () => {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity style={styles.markBtn} onPress={markAllRead}>
              <Text style={styles.markBtnText}>Mark All read</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>TODAY</Text>
        {todayItems.map((item) => (
          <AppCard key={item.id} style={styles.notificationCard}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <NotificationIcon type={item.icon} color={item.accent} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.cardTime}>{item.time}</Text>
                <Text style={styles.orderNow}>Order now</Text>
              </View>
            </View>
          </AppCard>
        ))}

        <Text style={styles.sectionTitle}>EARLIER</Text>
        {earlierItems.map((item) => (
          <AppCard key={item.id} style={styles.notificationCard}>
            <View style={[styles.iconWrap, { backgroundColor: item.bg }]}>
              <NotificationIcon type={item.icon} color={item.accent} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 12 },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700', flex: 1 },
  markBtn: {
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  markBtnText: { color: '#FFFFFF', fontSize: 10, fontWeight: '600' },
  unreadText: { marginLeft: 56, marginTop: 4, color: '#D1D5DB', fontSize: 10, fontWeight: '600' },
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#6B7280', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 6 },
  notificationCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  cardBody: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: PRIMARY_COLOR },
  cardDescription: { color: '#6B7280', fontSize: 10, marginTop: 2, lineHeight: 13 },
  metaRow: { marginTop: 4, flexDirection: 'row', justifyContent: 'space-between' },
  cardTime: { color: '#9CA3AF', fontSize: 9 },
  orderNow: { color: PRIMARY_COLOR, fontSize: 9, fontWeight: '700' },
});
