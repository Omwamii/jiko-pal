import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useRefillRequestDetails } from '@/hooks/refill';

const PRIMARY_COLOR = '#3629B7';

export default function VendorOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ customer?: string; orderId?: string; phone?: string; status?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  
  const { fetchRequest, refillRequest, isLoading } = useRefillRequestDetails();
  
  useEffect(() => {
    if (orderId) {
      fetchRequest(orderId);
    }
  }, [orderId, fetchRequest]);

  const status = refillRequest?.status || 'pending';
  const customerName = params.customer || refillRequest?.client?.full_name || 'Customer';
  const customerPhone = params.phone || refillRequest?.client?.phone_number || '';

  const getInitials = (name: string) => {
    if (!name) return 'CU';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const statusMeta = {
    title: status === 'completed' ? 'Order Completed' :
           status === 'cancelled' ? 'Order Cancelled' :
           status === 'accepted' || status === 'in_transit' ? 'Order Accepted' : 'Order Pending',
    label: status === 'completed' ? 'Completed' :
           status === 'cancelled' ? 'Cancelled' :
           status === 'accepted' || status === 'in_transit' ? 'In Progress' : 'Pending',
    bg: status === 'accepted' || status === 'in_transit' ? '#E0E7FF' : 
        status === 'completed' ? '#D1FAE5' :
        status === 'cancelled' ? '#FEE2E2' : '#FEF3C7',
    color: status === 'accepted' || status === 'in_transit' ? '#4F46E5' :
        status === 'completed' ? '#10B981' :
        status === 'cancelled' ? '#EF4444' : '#D08B17',
  };

  const callCustomer = async () => {
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

  const handleMarkDelivered = () => {
    router.push((`/vendor-mark-delivered?orderId=${orderId || ''}&customer=${customerName}`) as Href);
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
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : (
          <>
            <View style={styles.customerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(customerName)}</Text>
              </View>
              <Text style={styles.customerName}>{customerName}</Text>
              <View style={[styles.statusPill, { backgroundColor: statusMeta.bg }]}>
                <Text style={[styles.statusPillText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85} onPress={callCustomer}>
                <MaterialCommunityIcons name="phone-outline" size={16} color="#16A34A" />
                <Text style={[styles.actionText, styles.callText]}>Call Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.directionsButton]} activeOpacity={0.85}>
                <MaterialCommunityIcons name="directions" size={16} color="#FFFFFF" />
                <Text style={[styles.actionText, styles.directionsText]}>Directions</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.scheduleCard}>
              <View style={styles.scheduleTitleRow}>
                <MaterialCommunityIcons name="clock-outline" size={14} color="#D48C18" />
                <Text style={styles.scheduleTitle}>Scheduled for</Text>
              </View>
              <Text style={styles.scheduleTime}>
                {refillRequest?.scheduled_date 
                  ? new Date(refillRequest.scheduled_date).toLocaleDateString() 
                  : 'Not scheduled'}
              </Text>
            </View>

            <View style={styles.locationCard}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#EF4444" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>123 Kimathi Street, Nairobi</Text>
                <Text style={styles.landmarkText}>Landmark: Near Java House</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>3.2 km away</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>15 mins</Text>
                </View>
              </View>
            </View>

            {refillRequest?.notes && (
              <View style={styles.instructionsCard}>
                <View style={styles.instructionsTitleRow}>
                  <MaterialCommunityIcons name="note-text-outline" size={13} color="#D48C18" />
                  <Text style={styles.instructionsTitle}>Special Instructions</Text>
                </View>
                <Text style={styles.instructionsText}>{refillRequest.notes}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.mapButton} activeOpacity={0.85}>
              <MaterialCommunityIcons name="send-outline" size={16} color="#FFFFFF" />
              <Text style={styles.mapButtonText}>Open in Maps</Text>
            </TouchableOpacity>

            {status === 'accepted' || status === 'in_transit' ? (
              <TouchableOpacity style={styles.markButton} activeOpacity={0.85} onPress={handleMarkDelivered}>
                <MaterialCommunityIcons name="cube-outline" size={16} color="#5F4ED8" />
                <Text style={styles.markButtonText}>Mark Delivered</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.readOnlyState}>
                <Text style={styles.readOnlyStateText}>
                  {status === 'completed' 
                    ? 'This order has already been delivered.' 
                    : status === 'cancelled'
                      ? 'This order was cancelled and is read-only.'
                      : 'This order is pending acceptance.'}
                </Text>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </>
        )}
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
  },
  badgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  sheet: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 16 },
  loader: { marginTop: 40 },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  customerName: { flex: 1, marginLeft: 10, fontSize: 18, fontWeight: '600', color: '#111827' },
  statusPill: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  statusPillText: { fontSize: 11, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', marginTop: 20, gap: 10 },
  actionButton: { flex: 1, height: 44, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  callButton: { backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#86EFAC' },
  directionsButton: { backgroundColor: '#14B27A' },
  actionText: { fontSize: 12, fontWeight: '600' },
  callText: { color: '#16A34A' },
  directionsText: { color: '#FFFFFF' },
  scheduleCard: { marginTop: 20, backgroundColor: '#FFFBEB', padding: 14, borderRadius: 12 },
  scheduleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scheduleTitle: { color: '#92400E', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  scheduleTime: { color: '#78350F', fontSize: 16, fontWeight: '700' },
  locationCard: { marginTop: 10, flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 14, borderRadius: 12 },
  locationInfo: { marginLeft: 8, flex: 1 },
  locationText: { color: '#111827', fontSize: 14, fontWeight: '600' },
  landmarkText: { color: '#6B7280', fontSize: 11, marginTop: 2 },
  metaRow: { flexDirection: 'row', marginTop: 4 },
  metaText: { color: '#9CA3AF', fontSize: 10 },
  metaDot: { color: '#9CA3AF', fontSize: 10, marginHorizontal: 6 },
  instructionsCard: { marginTop: 10, backgroundColor: '#FFFBEB', padding: 14, borderRadius: 12 },
  instructionsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  instructionsTitle: { color: '#92400E', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  instructionsText: { color: '#78350F', fontSize: 12 },
  mapButton: { marginTop: 16, height: 44, borderRadius: 22, backgroundColor: '#14B27A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  mapButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  markButton: { marginTop: 10, height: 44, borderRadius: 22, backgroundColor: '#D0CDEB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  markButtonText: { color: '#5F4ED8', fontSize: 12, fontWeight: '600' },
  readOnlyState: { marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', padding: 10 },
  readOnlyStateText: { color: '#6B7280', fontSize: 10, textAlign: 'center', fontWeight: '600' },
  bottomSpacer: { height: 14 },
});