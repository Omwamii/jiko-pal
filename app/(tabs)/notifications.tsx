import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead, useUnreadNotificationCount } from '@/hooks/queries';
import { Notification } from '@/types';

const PRIMARY_COLOR = '#3629B7';

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'alert':
      return 'alert-circle-outline';
    case 'warning':
      return 'alert-outline';
    case 'info':
    default:
      return 'bell-outline';
  }
}

function getIconColors(type: Notification['type'], isRead: boolean) {
  if (type === 'alert') return { accent: '#EF4444', bg: '#FEE2E2' };
  if (type === 'warning') return { accent: '#F59E0B', bg: '#FEF3C7' };
  return { accent: PRIMARY_COLOR, bg: isRead ? '#F3F4F6' : '#E0E7FF' };
}

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { data: notificationsData, isLoading, refetch } = useNotifications({ limit: '20' });
  const { data: unreadCountData } = useUnreadNotificationCount();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const markReadMutation = useMarkNotificationRead();

  const notifications = notificationsData?.results || [];
  const unreadCount = unreadCountData?.unread_count || 0;

  const todayItems = useMemo(() => {
    const today = new Date().toDateString();
    return notifications.filter(n => new Date(n.created_at).toDateString() === today);
  }, [notifications]);

  const earlierItems = useMemo(() => {
    const today = new Date().toDateString();
    return notifications.filter(n => new Date(n.created_at).toDateString() !== today);
  }, [notifications]);

  const handleMarkAllRead = async () => {
    await markAllReadMutation.mutateAsync();
    refetch();
  };

  const handleNotificationPress = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markReadMutation.mutateAsync(id);
      refetch();
    }
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
            <TouchableOpacity 
              style={styles.markBtn} 
              onPress={handleMarkAllRead}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
            >
              <Text style={styles.markBtnText}>
                {markAllReadMutation.isPending ? '...' : 'Mark All read'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications</Text>
        ) : (
          <>
            {todayItems.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>TODAY</Text>
                {todayItems.map((item) => {
                  const colors = getIconColors(item.type, item.is_read);
                  return (
                    <AppCard 
                      key={item.id} 
                      style={styles.notificationCard}
                      onPress={() => handleNotificationPress(item.id, item.is_read)}
                    >
                      <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                        <MaterialCommunityIcons 
                          name={getNotificationIcon(item.type) as any} 
                          size={14} 
                          color={colors.accent} 
                        />
                      </View>
                      <View style={styles.cardBody}>
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{item.title}</Text>
                          {!item.is_read ? <View style={styles.unreadDot} /> : null}
                        </View>
                        <Text style={styles.cardDescription}>{item.body}</Text>
                        <View style={styles.metaRow}>
                          <Text style={styles.cardTime}>{formatRelativeTime(item.created_at)}</Text>
                        </View>
                      </View>
                    </AppCard>
                  );
                })}
              </>
            )}

            {earlierItems.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>EARLIER</Text>
                {earlierItems.map((item) => {
                  const colors = getIconColors(item.type, item.is_read);
                  return (
                    <AppCard 
                      key={item.id} 
                      style={styles.notificationCard}
                      onPress={() => handleNotificationPress(item.id, item.is_read)}
                    >
                      <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                        <MaterialCommunityIcons 
                          name={getNotificationIcon(item.type) as any} 
                          size={14} 
                          color={colors.accent} 
                        />
                      </View>
                      <View style={styles.cardBody}>
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{item.title}</Text>
                          {!item.is_read ? <View style={styles.unreadDot} /> : null}
                        </View>
                        <Text style={styles.cardDescription}>{item.body}</Text>
                        <Text style={styles.cardTime}>{formatRelativeTime(item.created_at)}</Text>
                      </View>
                    </AppCard>
                  );
                })}
              </>
            )}
          </>
        )}
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
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontSize: 14, marginTop: 20 },
});
