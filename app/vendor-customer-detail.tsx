import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useSubscriberDetail, SubscriberDevice } from '@/hooks/vendor';

export default function VendorCustomerDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ subscriptionId?: string; name?: string; email?: string }>();
  const subscriptionId = params.subscriptionId;
  const passedName = params.name;
  const passedEmail = params.email;

  const { detail, devices: subscriberDevices, isLoading, fetchSubscriberDetail } = useSubscriberDetail();

  const name = detail?.client?.full_name || passedName || 'John Doe';
  const email = detail?.client?.email || passedEmail || '';

  const ordersCount = detail?.orders_count ?? 0;
  const cylindersCount = detail?.cylinders_count ?? 0;

  const getCircleName = (device: SubscriberDevice) => {
    if (device.circle) return device.circle;
    return 'Unassigned';
  };

  const getInitials = (n: string) => {
    const parts = n.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (subscriptionId) {
        fetchSubscriberDetail(subscriptionId);
      }
    }, [subscriptionId, fetchSubscriberDetail])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Customer Details</Text>

            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {isLoading ? (
        <View style={[styles.sheet, styles.loadingContainer]}>
          <ActivityIndicator size="large" color="#3629B7" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.sheet}>
            <View style={styles.customerRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials(name)}</Text></View>
              <Text style={styles.customerName}>{name}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statTop}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={13} color="#6D6F82" />
                  <Text style={styles.statLabel}>Orders</Text>
                </View>
                <Text style={styles.statValue}>{ordersCount}</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statTop}>
                  <MaterialCommunityIcons name="check-circle-outline" size={13} color="#18A875" />
                  <Text style={styles.statLabel}>Cylinders</Text>
                </View>
                <Text style={styles.statValue}>{cylindersCount}</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={[styles.actionButton, styles.callButton]} activeOpacity={0.85}>
                <MaterialCommunityIcons name="phone-outline" size={16} color="#16A34A" />
                <Text style={[styles.actionText, styles.callText]}>Call Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.messageButton]} 
                activeOpacity={0.85}
                onPress={() => router.push(`/vendor-customer-chat?customer=${encodeURIComponent(name)}&phone=${encodeURIComponent(detail?.client?.phone_number || '')}&subscriptionId=${subscriptionId}`)}
              >
                <MaterialCommunityIcons name="message-outline" size={16} color="#3629B7" />
                <Text style={[styles.actionText, styles.messageText]}>Message</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Contact Information</Text>
            {detail?.client?.phone_number && (
              <Text style={styles.contactText}>{detail.client.phone_number}</Text>
            )}
            <Text style={styles.contactText}>{email}</Text>
            {(detail?.client?.location_latitude || detail?.client?.location_longitude) && (
              <Text style={styles.contactText}>
                {detail.client.location_latitude}, {detail.client.location_longitude}
              </Text>
            )}

            <Text style={styles.sectionTitle}>Cylinders</Text>
            {isLoading ? (
              <Text style={styles.emptyText}>Loading cylinders...</Text>
            ) : subscriberDevices.length === 0 ? (
              cylindersCount > 0 ? (
                <Text style={styles.emptyText}>{cylindersCount} cylinder(s) connected</Text>
              ) : (
                <Text style={styles.emptyText}>No cylinders connected</Text>
              )
            ) : (
              subscriberDevices.map((device) => {
                const status = device.current_level < 20 ? 'critical' : device.current_level < 40 ? 'low' : 'good';
                return (
                <TouchableOpacity
                  key={device.id}
                  style={styles.cylinderCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/vendor-monitor-detail?deviceId=${device.device_id}&name=${encodeURIComponent(device.device_id)}&percent=${device.current_level}&sub=${encodeURIComponent(getCircleName(device))}&status=${status}`)}
                >
                  <View style={[styles.cylinderIcon, { backgroundColor: device.current_level < 20 ? '#FFEECF' : '#D9F8EA' }]}>
                    <MaterialCommunityIcons name="water" size={15} color={device.current_level < 20 ? '#D48C18' : '#18A875'} />
                  </View>
                  <View style={styles.cylinderMeta}>
                    <Text style={styles.cylinderName}>{device.device_id}</Text>
                    <Text style={styles.cylinderSub}>{getCircleName(device)}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${device.current_level}%`, backgroundColor: device.current_level < 20 ? '#D48C18' : '#18A875' }]} />
                    </View>
                  </View>
                  <MaterialCommunityIcons name="chevron-right" size={17} color="#75778A" />
                </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      <VendorBottomNav active="monitors" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F3F7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
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
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    paddingVertical: 20,
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
  avatarText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  customerName: { marginLeft: 10, color: '#151621', fontSize: 20, fontWeight: '700' },
  statsRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
  },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statLabel: { color: '#8D8EA0', fontSize: 9 },
  statValue: { marginTop: 4, color: '#171821', fontSize: 30, fontWeight: '700' },
  actionsRow: { marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: {
    width: '48%',
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  callButton: { backgroundColor: '#CDF2E4' },
  messageButton: { backgroundColor: '#D6D3F5' },
  actionText: { fontSize: 12, fontWeight: '600' },
  callText: { color: '#16A34A' },
  messageText: { color: '#3629B7' },
  sectionTitle: { marginTop: 14, color: '#1A1B24', fontSize: 17, fontWeight: '700' },
  contactText: { marginTop: 4, color: '#8C8D9F', fontSize: 10 },
  cylinderCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cylinderIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cylinderMeta: { flex: 1, marginLeft: 8 },
  cylinderName: { color: '#13141F', fontSize: 12, fontWeight: '700' },
  cylinderSub: { color: '#888A9C', fontSize: 9, marginTop: 1 },
  barTrack: {
    marginTop: 4,
    width: '80%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  barFill: { height: '100%' },
});