import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

export default function VendorOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ customer?: string; orderId?: string }>();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Order Accepted</Text>

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

          <Text style={styles.customerName}>{params.customer || 'Sarah Anderson'}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85}>
            <MaterialCommunityIcons name="phone-outline" size={16} color="#16A34A" />
            <Text style={[styles.actionText, styles.callText]}>Call Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.messageButton]} activeOpacity={0.85}>
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

        <TouchableOpacity
          style={styles.markButton}
          activeOpacity={0.85}
          onPress={() => {
            const orderId = encodeURIComponent(params.orderId || '');
            const customer = encodeURIComponent(params.customer || '');
            router.push((`/vendor-mark-delivered?orderId=${orderId}&customer=${customer}`) as Href);
          }}
        >
          <MaterialCommunityIcons name="cube-outline" size={16} color="#5F4ED8" />
          <Text style={styles.markButtonText}>Mark Delivered</Text>
        </TouchableOpacity>

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
  customerName: { marginLeft: 10, color: '#141417', fontSize: 30, fontWeight: '700' },
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
  bottomSpacer: { height: 14 },
});
