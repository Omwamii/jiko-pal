import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useVendorOrders } from '@/hooks/refill';
import { useAuth } from '@/providers/AuthProvider';
import { useUnreadNotificationCount } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

const quickActions = [
  { label: 'Orders', icon: 'clipboard-text-outline' as const },
  { label: 'Subscribers', icon: 'account-group-outline' as const },
  { label: 'Analytics', icon: 'chart-line' as const },
];

function getOrderStatusMeta(status: string) {
  if (status === 'in_transit' || status === 'accepted') {
    return { label: 'Active', bg: '#E7E3FF', color: '#5B4DCB' };
  }

  if (status === 'pending') {
    return { label: 'Pending', bg: '#F4E4C3', color: '#D08B17' };
  }

  if (status === 'completed') {
    return { label: 'Completed', bg: '#D1FAE5', color: '#10B981' };
  }

  return { label: status.charAt(0).toUpperCase() + status.slice(1), bg: '#F3F4F6', color: '#6B7280' };
}

function getInitials(name: string) {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function VendorDashboardScreen() {
  const router = useRouter();
  const { vendorProfile } = useAuth();
  const { orders, isLoading, fetchOrders } = useVendorOrders();
  const { data: unreadCountData } = useUnreadNotificationCount();
  const [activeOrderTab, setActiveOrderTab] = useState<string>('active');

  const unreadCount = unreadCountData?.unread_count || 0;

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (vendorProfile?.company_name) {
      fetchOrders();
    }
  }, [vendorProfile, fetchOrders]);

  const activeOrders = useMemo(() => 
    orders.filter((order) => order.status === 'in_transit' || order.status === 'accepted'),
    [orders]
  );
  const pendingOrders = useMemo(() => 
    orders.filter((order) => order.status === 'pending'),
    [orders]
  );
  const completedOrders = useMemo(() => 
    orders.filter((order) => order.status === 'completed'),
    [orders]
  );

  const stats = useMemo(() => [
    { label: 'Orders', value: String(orders.length), hint: 'Total orders' },
    { label: 'Active', value: String(activeOrders.length), hint: 'In progress' },
    { label: 'Pending', value: String(pendingOrders.length), hint: 'Waiting' },
    { label: 'Completed', value: String(completedOrders.length), hint: 'Delivered' },
  ], [orders, activeOrders, pendingOrders, completedOrders]);
 
  const visibleOrders = useMemo(() => {
    if (activeOrderTab === 'active') return activeOrders;
    if (activeOrderTab === 'pending') return pendingOrders;
    return completedOrders;
  }, [activeOrderTab, activeOrders, pendingOrders, completedOrders]);

  const vendorName = vendorProfile?.company_name || 'Vendor';

  const emptyDashboardOrdersMessage = useMemo(() => {
    if (activeOrderTab === 'active') return 'No orders in progress';
    if (activeOrderTab === 'pending') return 'No pending orders';
    return 'No completed orders';
  }, [activeOrderTab]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <Text style={styles.welcomeText}>Welcome back, vendor!</Text>
          <View style={styles.headerRow}>
            <Text style={styles.brandTitle}>QuickGas Distributors</Text>
            <TouchableOpacity 
              style={styles.notificationButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/vendor-notifications' as Href)}
            >
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statHint}>{item.hint}</Text>
              </View>
            ))}
          </View>

          <View style={styles.offerCard}>
            <View style={styles.offerIcon}>
              <MaterialCommunityIcons name="tag-outline" size={12} color="#E19B0B" />
            </View>
            <Text style={styles.offerTitle}>{pendingOrders.length} Pending Offer{pendingOrders.length !== 1 ? 's' : ''}</Text>
            <Text style={styles.offerSubtitle}>
              {pendingOrders.length === 0 
                ? 'No new delivery requests' 
                : 'You have new delivery requests waiting for your response'}
            </Text>
            <TouchableOpacity
              style={styles.offerButton}
              activeOpacity={0.8}
              onPress={() => router.push('/vendor-orders' as Href)}
            >
              <Text style={styles.offerButtonText}>View Orders</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickActionCard}
                activeOpacity={0.8}
                onPress={() => {
                  if (action.label === 'Orders') {
                    router.push('/vendor-orders' as Href);
                    return;
                  }

                  if (action.label === 'Subscribers') {
                    router.push('/vendor-subscribers' as Href);
                    return;
                  }

                  if (action.label === 'Analytics') {
                    router.push('/vendor-analytics' as Href);
                  }
                }}
              >
                <View style={styles.quickIcon}>
                  <MaterialCommunityIcons name={action.icon} size={18} color="#3629B7" />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/vendor-orders' as Href)}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterPill, activeOrderTab === 'active' && styles.filterPillActive]}
              activeOpacity={0.85}
              onPress={() => setActiveOrderTab('active')}
            >
              <Text style={activeOrderTab === 'active' ? styles.filterTextActive : styles.filterText}>Active ({activeOrders.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeOrderTab === 'pending' && styles.filterPillActive]}
              activeOpacity={0.85}
              onPress={() => setActiveOrderTab('pending')}
            >
              <Text style={activeOrderTab === 'pending' ? styles.filterTextActive : styles.filterText}>Pending ({pendingOrders.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterPill, activeOrderTab === 'completed' && styles.filterPillActive]}
              activeOpacity={0.85}
              onPress={() => setActiveOrderTab('completed')}
            >
              <Text style={activeOrderTab === 'completed' ? styles.filterTextActive : styles.filterText}>
                Completed ({completedOrders.length})
              </Text>
            </TouchableOpacity>
          </View>

          {visibleOrders.length === 0 ? (
            isLoading ? (
              <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
            ) : (
              <Text style={styles.emptyText}>{emptyDashboardOrdersMessage}</Text>
            )
          ) : null}
          {visibleOrders.map((order) => {
            const statusMeta = getOrderStatusMeta(order.status);
            const customerName = order.client?.full_name || 'Customer';
            const phone = order.client?.phone_number || '';
            const initials = getInitials(customerName);
            const scheduledDate = order.scheduled_date ? new Date(order.scheduled_date).toLocaleDateString() : '';

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/vendor-order-detail',
                    params: {
                      orderId: order.id,
                      customer: customerName,
                      phone: phone,
                    },
                  } as Href)
                }
              >
                <View style={styles.orderTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{customerName}</Text>
                    {scheduledDate ? (
                      <View style={styles.distanceRow}>
                        <MaterialCommunityIcons name="calendar-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.distanceText}>{scheduledDate}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
                    <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                  </View>
                </View>

                {order.notes ? (
                  <Text style={styles.orderNotes} numberOfLines={2}>{order.notes}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <VendorBottomNav active="home" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
  },
  safeHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  welcomeText: {
    color: '#DAD7FF',
    fontSize: 10,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F04438',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F5F6FB',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    width: '48.7%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statLabel: {
    color: '#78708E',
    fontSize: 11,
    fontWeight: '500',
  },
  statValue: {
    color: '#101012',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 5,
  },
  statHint: {
    color: '#2EA75C',
    fontSize: 9,
    marginTop: 3,
  },
  offerCard: {
    marginTop: 14,
    backgroundColor: '#F4E6D2',
    borderWidth: 1,
    borderColor: '#EAD4B7',
    borderRadius: 12,
    padding: 12,
  },
  offerIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E9C89A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerTitle: {
    marginTop: 6,
    color: '#99620E',
    fontSize: 11,
    fontWeight: '600',
  },
  offerSubtitle: {
    marginTop: 5,
    color: '#C58720',
    fontSize: 9,
  },
  offerButton: {
    marginTop: 9,
    alignSelf: 'flex-start',
    backgroundColor: '#E8C48F',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  offerButtonText: {
    color: '#94610E',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 16,
    color: '#151521',
    fontSize: 18,
    fontWeight: '700',
  },
  quickRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '31.7%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  quickIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    color: '#2A2A32',
    fontSize: 10,
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAllText: {
    color: PRIMARY_COLOR,
    fontSize: 11,
    fontWeight: '600',
  },
  filterRow: {
    marginTop: 9,
    flexDirection: 'row',
    gap: 5,
  },
  filterPill: {
    height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E2EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
  filterText: {
    color: '#8A849A',
    fontSize: 9,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 12,
    color: '#8E8FA1',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  orderCard: {
    marginTop: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    marginBottom: 8,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  orderInfo: {
    flex: 1,
    marginLeft: 8,
  },
  customerName: {
    color: '#11131A',
    fontSize: 14,
    fontWeight: '600',
  },
  distanceRow: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  distanceText: {
    color: '#8E8FA1',
    fontSize: 9,
  },
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 11,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
  },
  progressText: {
    marginTop: 3,
    color: '#71717F',
    fontSize: 9,
    textAlign: 'right',
  },
  loader: {
    marginTop: 20,
  },
  orderNotes: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 12,
  },
});
