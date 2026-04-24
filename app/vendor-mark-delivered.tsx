import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useCompleteRefillRequest } from '@/hooks/refill';

const SECONDARY_COLOR = '#14B27A';

export default function VendorMarkDeliveredScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ customer?: string; orderId?: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const customerName = Array.isArray(params.customer) ? params.customer[0] : params.customer;
  
  const { completeOrder, isLoading } = useCompleteRefillRequest();

  const getInitials = (name: string) => {
    if (!name) return 'CU';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleMarkDelivered = async () => {
    if (!orderId) {
      Alert.alert('Error', 'Order ID is missing');
      return;
    }

    try {
      await completeOrder(orderId);
      router.replace('/vendor-delivery-success' as Href);
    } catch (err) {
      Alert.alert('Error', 'Failed to mark as delivered. Please try again.');
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
            <Text style={styles.headerTitle}>Mark Delivered</Text>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.title}>Complete Delivery</Text>
        <Text style={styles.orderId}>Order #{orderId || 'N/A'}</Text>

        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{getInitials(customerName)}</Text></View>
            <View style={styles.summaryMeta}>
              <Text style={styles.customerName}>{customerName || 'Customer'}</Text>
              <Text style={styles.address}>123 Kimathi Street, Nairobi</Text>
            </View>
          </View>

          <View style={styles.summaryBottom}>
            <View>
              <Text style={styles.metaLabel}>Cylinder Size</Text>
              <Text style={styles.metaValue}>13kg</Text>
            </View>
            <View>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={styles.metaValue}>In Transit</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Delivery Proof (Optional)</Text>
        <Text style={styles.sectionSub}>Upload photos of delivered cylinders</Text>
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
          <MaterialCommunityIcons name="camera-outline" size={24} color="#8D8EA0" />
          <Text style={styles.uploadText}>Tap to upload photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.markDeliveredButton}
          activeOpacity={0.85}
          onPress={handleMarkDelivered}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="cube-outline" size={16} color="#FFFFFF" />
              <Text style={styles.markDeliveredText}>Mark as Delivered</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <VendorBottomNav active="orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
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
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 32, fontWeight: '600' },
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
  sheet: { flex: 1, backgroundColor: '#F3F3F7', paddingHorizontal: 14, paddingTop: 12 },
  title: { color: '#15151F', fontSize: 33, fontWeight: '700' },
  orderId: { color: '#9A9CAC', fontSize: 10, marginTop: 2 },
  sectionTitle: { marginTop: 14, color: '#1B1D25', fontSize: 23, fontWeight: '700' },
  sectionSub: { marginTop: 3, color: '#8D8EA0', fontSize: 9 },
  summaryCard: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
  },
  summaryTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#15B87A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  summaryMeta: { marginLeft: 8, flex: 1 },
  customerName: { color: '#11131A', fontSize: 13, fontWeight: '700' },
  address: { color: '#8E8FA1', fontSize: 9, marginTop: 1 },
  summaryBottom: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { color: '#8F8F9D', fontSize: 8 },
  metaValue: { color: '#232538', fontSize: 11, fontWeight: '600', marginTop: 2 },
  uploadBox: {
    marginTop: 7,
    borderWidth: 1,
    borderColor: '#D4D6E0',
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { marginTop: 5, color: '#8D8EA0', fontSize: 10 },
  reviewBox: {
    marginTop: 7,
    backgroundColor: '#ECEEF5',
    borderRadius: 8,
    height: 72,
    padding: 10,
  },
  reviewPlaceholder: { color: '#ADB0BF', fontSize: 10 },
  markDeliveredButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#14B27A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  markDeliveredText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});
