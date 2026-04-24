import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useActivityLogs } from '@/hooks/queries';
import { ActivityLog } from '@/types';

const PRIMARY_COLOR = '#3629B7';

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'refill_requested':
      return 'truck-delivery-outline';
    case 'refill_status_changed':
      return 'swap-horizontal-circle-outline';
    case 'cylinder_connected':
      return 'link-variant-plus';
    case 'cylinder_disconnected':
      return 'link-variant-remove';
    case 'circle_created':
      return 'account-group';
    case 'circle_joined':
      return 'account-plus';
    case 'circle_left':
      return 'account-minus';
    case 'vendor_subscribed':
      return 'store';
    case 'vendor_unsubscribed':
      return 'store-remove-outline';
    case 'password_changed':
      return 'lock-reset';
    case 'profile_updated':
      return 'account-edit';
    default:
      return 'information-outline';
  }
};

const getActivityColor = (action: string) => {
  switch (action) {
    case 'refill_requested':
      return { icon: PRIMARY_COLOR, bg: '#E0E7FF' };
    case 'refill_status_changed':
      return { icon: '#10B981', bg: '#D1FAE5' };
    case 'cylinder_connected':
      return { icon: '#10B981', bg: '#D1FAE5' };
    case 'cylinder_disconnected':
      return { icon: '#EF4444', bg: '#FEE2E2' };
    case 'circle_created':
    case 'circle_joined':
      return { icon: '#F59E0B', bg: '#FEF3C7' };
    case 'circle_left':
      return { icon: '#EF4444', bg: '#FEE2E2' };
    case 'vendor_subscribed':
      return { icon: '#10B981', bg: '#D1FAE5' };
    case 'vendor_unsubscribed':
      return { icon: '#EF4444', bg: '#FEE2E2' };
    case 'password_changed':
    case 'profile_updated':
      return { icon: '#6B7280', bg: '#F3F4F6' };
    default:
      return { icon: '#9CA3AF', bg: '#F3F4F6' };
  }
};

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

export default function RecentActivityScreen() {
  const router = useRouter();
  const { data: activityLogs, isLoading } = useActivityLogs(20);

  const groupedLogs = useMemo(() => {
    if (!activityLogs) return { today: [], earlier: [] };
    
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    return {
      today: activityLogs.filter(log => {
        const logDate = new Date(log.created_at).toDateString();
        return logDate === today || logDate === yesterday;
      }),
      earlier: activityLogs.filter(log => {
        const logDate = new Date(log.created_at).toDateString();
        return logDate !== today && logDate !== yesterday;
      }),
    };
  }, [activityLogs]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Recent Activity</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : activityLogs?.length === 0 ? (
          <Text style={styles.emptyText}>No recent activity</Text>
        ) : (
          <>
            {groupedLogs.today.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>TODAY</Text>
                {groupedLogs.today.map((activity) => {
                  const colors = getActivityColor(activity.action);
                  return (
                    <AppCard key={activity.id} style={styles.itemCard}>
                      <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                        <MaterialCommunityIcons 
                          name={getActivityIcon(activity.action) as any} 
                          size={16} 
                          color={colors.icon} 
                        />
                      </View>
                      <View style={styles.itemBody}>
                        <Text style={styles.itemTitle}>{activity.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {activity.subtitle || activity.description || ''}
                        </Text>
                        <Text style={styles.itemTime}>
                          {formatRelativeTime(activity.created_at)}
                        </Text>
                      </View>
                    </AppCard>
                  );
                })}
              </>
            )}

            {groupedLogs.earlier.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>EARLIER</Text>
                {groupedLogs.earlier.map((activity) => {
                  const colors = getActivityColor(activity.action);
                  return (
                    <AppCard key={activity.id} style={styles.itemCard}>
                      <View style={[styles.iconWrap, { backgroundColor: colors.bg }]}>
                        <MaterialCommunityIcons 
                          name={getActivityIcon(activity.action) as any} 
                          size={16} 
                          color={colors.icon} 
                        />
                      </View>
                      <View style={styles.itemBody}>
                        <Text style={styles.itemTitle}>{activity.title}</Text>
                        <Text style={styles.itemSubtitle}>
                          {activity.subtitle || activity.description || ''}
                        </Text>
                        <Text style={styles.itemTime}>
                          {formatRelativeTime(activity.created_at)}
                        </Text>
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
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#6B7280', fontSize: 12, fontWeight: '700', marginBottom: 8, marginTop: 6 },
  itemCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemBody: { flex: 1 },
  itemTitle: { color: '#11181C', fontSize: 13, fontWeight: '700' },
  itemSubtitle: { color: '#6B7280', fontSize: 10, marginTop: 2 },
  itemTime: { color: '#9CA3AF', fontSize: 9, marginTop: 4 },
  loader: { marginTop: 40 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontSize: 14, marginTop: 20 },
});
