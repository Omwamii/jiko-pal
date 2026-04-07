import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

type DetailOrderStatus = 'pending' | 'in-progress' | 'completed' | 'rejected';

export default function VendorOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ customer?: string; orderId?: string; phone?: string; status?: DetailOrderStatus }>();
  const customer = Array.isArray(params.customer) ? params.customer[0] : params.customer;
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const status = (Array.isArray(params.status) ? params.status[0] : params.status) || 'in-progress';

  const statusMeta = (() => {
    if (status === 'completed') {
      return { title: 'Order Completed', label: 'Completed', bg: '#D1FAE5', color: '#10B981' };
    }

    if (status === 'rejected') {
      return { title: 'Order Rejected', label: 'Rejected', bg: '#FEE2E2', color: '#EF4444' };
    }

    if (status === 'pending') {
      return { title: 'Order Pending', label: 'Pending', bg: '#FEF3C7', color: '#D08B17' };
    }

    return { title: 'Order Accepted', label: 'In Progress', bg: '#E0E7FF', color: '#4F46E5' };
  })();

  const callCustomer = async () => {
    const customerPhone = (phone || '+254712345678').trim();
    const phoneUrl = `tel:${customerPhone}`;

    try {
      const supported = await Linking.canOpenURL(phoneUrl);
      if (!supported) {
        Alert.alert('Call unavailable', `Your device cannot place calls to ${customerPhone}.`);
        return;
      }

      await Linking.openURL(phoneUrl);
    } catch {
      Alert.alert('Call failed', 'Unable to open phone app right now. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{statusMeta.title}</Text>

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
        <View style={styles.customerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>GP</Text>
          </View>

          <Text style={styles.customerName}>{customer || 'Sarah Anderson'}</Text>
          <View style={[styles.statusPill, { backgroundColor: statusMeta.bg }]}>
            <Text style={[styles.statusPillText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85} onPress={callCustomer}>
            <MaterialCommunityIcons name="phone-outline" size={16} color="#16A34A" />
            <Text style={[styles.actionText, styles.callText]}>Call Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/vendor-customer-chat',
                params: {
                  customer: customer || 'Sarah Anderson',
                  phone: phone || '+254712345678',
                },
              } as Href)
            }
          >
            <MaterialCommunityIcons name="message-outline" size={16} color="#3629B7" />
            <Text style={[styles.actionText, styles.messageText]}>Message</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.card}>
          <View style={styles.itemRow}>
            <View style={styles.itemIconWrap}>
              <MaterialCommunityIcons name="gas-cylinder" size={16} color="#18A875" />
            </View>
            <View style={styles.itemMeta}>
              <Text style={styles.itemName}>Main Cylinder - 13kg</Text>
              <Text style={styles.itemSub}>Refill</Text>
            </View>
            <Text style={styles.itemQty}>x1</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <Text style={styles.locationText}>123 Kimathi Street, Nairobi</Text>
        <Text style={styles.landmarkText}>Landmark: Near Java House</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>3.2 km away</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>15 mins</Text>
        </View>

        <View style={styles.instructionsCard}>
          <View style={styles.instructionsTitleRow}>
            <MaterialCommunityIcons name="note-text-outline" size={13} color="#D48C18" />
            <Text style={styles.instructionsTitle}>Special Instructions</Text>
          </View>
          <Text style={styles.instructionsText}>Please call when you arrive. Gate code is 1224</Text>
        </View>

        <TouchableOpacity style={styles.mapButton} activeOpacity={0.85}>
          <MaterialCommunityIcons name="send-outline" size={16} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>Open in Maps</Text>
        </TouchableOpacity>

        {status === 'in-progress' ? (
          <TouchableOpacity
            style={styles.markButton}
            activeOpacity={0.85}
            onPress={() => {
              const encodedOrderId = encodeURIComponent(orderId || '');
              const encodedCustomer = encodeURIComponent(customer || '');
              router.push((`/vendor-mark-delivered?orderId=${encodedOrderId}&customer=${encodedCustomer}`) as Href);
            }}
          >
            <MaterialCommunityIcons name="cube-outline" size={16} color="#5F4ED8" />
            <Text style={styles.markButtonText}>Mark Delivered</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.readOnlyState}>
            <Text style={styles.readOnlyStateText}>
              {status === 'completed' ? 'This order has already been delivered.' : 'This order was rejected and is read-only.'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </View>

      <VendorBottomNav active="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14B27A' },
  header: { backgroundColor: '#14B27A' },
  safeHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
  },
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 24, fontWeight: '600' },
  notificationButton: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
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
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  customerName: { marginLeft: 10, color: '#141417', fontSize: 30, fontWeight: '700', flex: 1 },
  statusPill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  statusPillText: { fontSize: 9, fontWeight: '700' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  actionButton: {
    width: '48%',
    borderRadius: 10,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  callButton: { backgroundColor: '#CDF2E4' },
  messageButton: { backgroundColor: '#D6D3F5' },
  actionText: { fontSize: 12, fontWeight: '600' },
  callText: { color: '#16A34A' },
  messageText: { color: '#3629B7' },
  sectionTitle: { marginTop: 16, color: '#1B1D25', fontSize: 26, fontWeight: '700' },
  card: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center' },
  itemIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E5F7EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemMeta: { flex: 1, marginLeft: 8 },
  itemName: { color: '#11131A', fontSize: 11, fontWeight: '600' },
  itemSub: { color: '#8D8EA0', fontSize: 9, marginTop: 1 },
  itemQty: { color: '#424354', fontSize: 11, fontWeight: '700' },
  locationText: { marginTop: 7, color: '#11131A', fontSize: 22, fontWeight: '600' },
  landmarkText: { marginTop: 2, color: '#8D8EA0', fontSize: 10 },
  metaRow: { marginTop: 5, flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#8D8EA0', fontSize: 9 },
  metaDot: { color: '#8D8EA0', fontSize: 10 },
  instructionsCard: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E9D6BA',
    backgroundColor: '#F6E9D6',
    padding: 10,
  },
  instructionsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  instructionsTitle: { color: '#D48C18', fontSize: 10, fontWeight: '600' },
  instructionsText: { marginTop: 4, color: '#C18421', fontSize: 9 },
  mapButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3629B7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  markButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D0CDEB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  markButtonText: { color: '#5F4ED8', fontSize: 12, fontWeight: '600' },
  readOnlyState: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 10,
  },
  readOnlyStateText: {
    color: '#6B7280',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomSpacer: { height: 14 },
});
