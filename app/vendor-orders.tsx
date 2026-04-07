import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';
type FilterKey = 'pending' | 'in-progress' | 'completed' | 'all';

type VendorOrder = {
  id: string;
  initials: string;
  customer: string;
  phone: string;
  distance: string;
  status: OrderStatus;
  cylinderSize: string;
  requested: string;
  progress?: number;
};

const PRIMARY_COLOR = '#3629B7';

const initialOrders: VendorOrder[] = [
  { id: 'ord-001', initials: 'GP', customer: 'Sarah Anderson', phone: '+254712345678', distance: '2.3 Km Away', status: 'pending', cylinderSize: '13kg', requested: '15 min ago', progress: 8 },
  { id: 'ord-002', initials: 'SA', customer: 'Sarah Anderson', phone: '+254712345678', distance: '2.3 Km Away', status: 'completed', cylinderSize: '13kg', requested: '15 min ago' },
  { id: 'ord-003', initials: 'GP', customer: 'Sarah Anderson', phone: '+254712345678', distance: '2.3 Km Away', status: 'pending', cylinderSize: '13kg', requested: '15 min ago', progress: 8 },
  { id: 'ord-004', initials: 'SA', customer: 'Sarah Anderson', phone: '+254712345678', distance: '2.3 Km Away', status: 'completed', cylinderSize: '13kg', requested: '15 min ago' },
  { id: 'ord-005', initials: 'SA', customer: 'Sarah Anderson', phone: '+254712345678', distance: '2.3 Km Away', status: 'rejected', cylinderSize: '13kg', requested: '15 min ago' },
];

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

function getStatusStyle(status: OrderStatus) {
  if (status === 'pending') {
    return { backgroundColor: '#F6E6C9', color: '#D48C18', label: 'Pending' };
  }

  if (status === 'completed') {
    return { backgroundColor: '#CFF2E4', color: '#18A875', label: 'Completed' };
  }

  if (status === 'rejected') {
    return { backgroundColor: '#F9CDD4', color: '#E44A69', label: 'Rejected' };
  }

  return { backgroundColor: '#E9E6FF', color: '#6B5DD9', label: 'In Progress' };
}

export default function VendorOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<VendorOrder[]>(initialOrders);
  const [filter, setFilter] = useState<FilterKey>('pending');
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);

  const visibleOrders = useMemo(() => {
    if (filter === 'all') {
      return orders;
    }

    return orders.filter((order) => order.status === filter);
  }, [orders, filter]);

  const declineOrder = (id: string) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: 'rejected' } : order)));
  };

  const confirmAccept = () => {
    if (!selectedOrder) {
      return;
    }

    setOrders((prev) => prev.map((order) => (order.id === selectedOrder.id ? { ...order, status: 'in-progress' } : order)));
    const customer = encodeURIComponent(selectedOrder.customer);
    const phone = encodeURIComponent(selectedOrder.phone);
    router.push((`/vendor-order-detail?orderId=${selectedOrder.id}&customer=${customer}&phone=${phone}&status=in-progress`) as Href);
    setSelectedOrder(null);
  };

  const emptyMessage = useMemo(() => {
    if (filter === 'all') {
      return 'No orders';
    }

    if (filter === 'in-progress') {
      return 'No orders in progress';
    }

    if (filter === 'pending') {
      return 'No pending orders';
    }

    return 'No completed orders';
  }, [filter]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>All Orders</Text>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.filterRow}>
          {filters.map((item) => {
            const active = item.key === filter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.8}
                onPress={() => setFilter(item.key)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {item.label} ({item.key === 'all' ? orders.length : orders.filter((order) => order.status === item.key).length})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {visibleOrders.length === 0 ? <Text style={styles.emptyText}>{emptyMessage}</Text> : null}
          {visibleOrders.map((order) => {
            const statusMeta = getStatusStyle(order.status);
            const pending = order.status === 'pending';

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                activeOpacity={0.9}
                onPress={() =>
                  router.push({
                    pathname: '/vendor-order-detail',
                    params: {
                      orderId: order.id,
                      customer: order.customer,
                      phone: order.phone,
                      status: order.status,
                    },
                  } as Href)
                }
              >
                <View style={styles.orderTop}>
                  <View style={[styles.avatar, { backgroundColor: order.initials === 'GP' ? '#F59E0B' : '#15B87A' }]}>
                    <Text style={styles.avatarText}>{order.initials}</Text>
                  </View>
                  <View style={styles.orderInfo}>
                    <Text style={styles.customerName}>{order.customer}</Text>
                    <View style={styles.distanceRow}>
                      <MaterialCommunityIcons name="map-marker-outline" size={12} color="#8E8FA1" />
                      <Text style={styles.distanceText}>{order.distance}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: statusMeta.backgroundColor }]}>
                    <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
                  </View>
                </View>

                {pending ? (
                  <>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${order.progress || 0}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{order.progress || 0}%</Text>
                  </>
                ) : null}

                <View style={styles.detailsRow}>
                  <View>
                    <Text style={styles.metaLabel}>Cylinder Size</Text>
                    <Text style={styles.metaValue}>{order.cylinderSize}</Text>
                  </View>
                  <View>
                    <Text style={styles.metaLabel}>Requested</Text>
                    <Text style={styles.metaValue}>{order.requested}</Text>
                  </View>
                </View>

                {pending ? (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      activeOpacity={0.85}
                      onPress={(event) => {
                        event.stopPropagation();
                        declineOrder(order.id);
                      }}
                    >
                      <Text style={styles.rejectText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      activeOpacity={0.85}
                      onPress={(event) => {
                        event.stopPropagation();
                        setSelectedOrder(order);
                      }}
                    >
                      <Text style={styles.acceptText}>Accept Order</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <VendorBottomNav active="orders" />
      </View>

      <Modal visible={!!selectedOrder} transparent animationType="fade" onRequestClose={() => setSelectedOrder(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalBody}>
              By accepting this order, you commit to delivering within the estimated time. The customer will be
              notified immediately and will expect timely service.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} activeOpacity={0.85} onPress={() => setSelectedOrder(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalAccept} activeOpacity={0.85} onPress={confirmAccept}>
                <Text style={styles.modalAcceptText}>Accept Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
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
    backgroundColor: '#F3F3F7',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  filterPill: {
    paddingHorizontal: 9,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E9E8F2',
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: PRIMARY_COLOR,
  },
  filterText: {
    color: '#7F7E8F',
    fontSize: 9,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 24,
  },
  emptyText: {
    marginTop: 14,
    marginBottom: 8,
    color: '#8F8F9D',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#EDEDF4',
    padding: 10,
    marginBottom: 10,
  },
  orderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 1,
  },
  distanceText: {
    color: '#8E8FA1',
    fontSize: 9,
  },
  statusPill: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  progressTrack: {
    marginTop: 10,
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
    color: '#727281',
    fontSize: 9,
    textAlign: 'right',
  },
  detailsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    color: '#8F8F9D',
    fontSize: 8,
  },
  metaValue: {
    color: '#222535',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    width: '47.5%',
    height: 27,
    borderRadius: 14,
    backgroundColor: '#ECECF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectText: {
    color: '#7C7C8F',
    fontSize: 10,
    fontWeight: '600',
  },
  acceptButton: {
    width: '47.5%',
    height: 27,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 27, 152, 0.74)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  modalTitle: {
    textAlign: 'center',
    color: '#232538',
    fontSize: 32,
    fontWeight: '700',
  },
  modalBody: {
    marginTop: 10,
    textAlign: 'center',
    color: '#63667A',
    fontSize: 10,
    lineHeight: 15,
  },
  modalActions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancel: {
    width: '47.5%',
    height: 27,
    borderRadius: 14,
    backgroundColor: '#ECECF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    color: '#7C7C8F',
    fontSize: 10,
    fontWeight: '600',
  },
  modalAccept: {
    width: '47.5%',
    height: 27,
    borderRadius: 14,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAcceptText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
});
