import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { useRefillRequests } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

type FilterKey = 'pending' | 'active' | 'completed' | 'all';

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

function getStatusStyle(status: string) {
  if (status === 'pending') {
    return { backgroundColor: '#F6E6C9', color: '#D48C18', label: 'Pending' };
  }
  if (status === 'completed') {
    return { backgroundColor: '#D1FAE5', color: '#10B981', label: 'Completed' };
  }
  if (status === 'cancelled') {
    return { backgroundColor: '#F9CDD4', color: '#E44A69', label: 'Cancelled' };
  }
  return { backgroundColor: '#E9E6FF', color: '#6B5DD9', label: 'In Progress' };
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function ClientOrdersScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>('all');
  const { data: ordersData, isLoading, refetch } = useRefillRequests({ limit: '20' });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const orders = useMemo(() => ordersData?.results || [], [ordersData]);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter(order => {
      if (filter === 'pending') return order.status === 'pending';
      if (filter === 'active') return order.status === 'accepted' || order.status === 'in_transit';
      if (filter === 'completed') return order.status === 'completed';
      return true;
    });
  }, [orders, filter]);

  const handleOrderPress = (order: any) => {
    const statusInfo = getStatusStyle(order.status);
    router.push({
      pathname: '/client-order-detail',
      params: {
        orderId: order.id,
        vendorName: order.provider?.company_name || 'Unknown',
        status: order.status,
        scheduledDate: order.scheduled_date || '',
        completedDate: order.completed_at || '',
        notes: order.notes || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Orders</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={filter === f.key ? styles.filterTextActive : styles.filterText}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusStyle(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
                activeOpacity={0.85}
              >
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
                  </View>
                </View>
                
                <Text style={styles.vendorName}>{order.provider?.company_name || 'Unknown Vendor'}</Text>
                
                <View style={styles.orderMeta}>
                  <View style={styles.metaItem}>
                    <MaterialCommunityIcons name="calendar" size={12} color="#9CA3AF" />
                    <Text style={styles.metaText}>
                      {order.scheduled_date 
                        ? new Date(order.scheduled_date).toLocaleDateString() 
                        : 'Not scheduled'}
                    </Text>
                  </View>
                  <Text style={styles.orderTime}>{(order as any).created_at ? formatRelativeTime((order as any).created_at) : 'Recently'}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingBottom: 12 },
  headerRow: {
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  filterPillActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: { color: '#6B7280', fontSize: 11, fontWeight: '600' },
  filterTextActive: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  scrollContent: { padding: 14, paddingBottom: 30 },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 14, marginTop: 12 },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: { color: '#9CA3AF', fontSize: 10, fontWeight: '600' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: { fontSize: 9, fontWeight: '700' },
  vendorName: { color: '#11181C', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#6B7280', fontSize: 10 },
  orderTime: { color: '#9CA3AF', fontSize: 10 },
});