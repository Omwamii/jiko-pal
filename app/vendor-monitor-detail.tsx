import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

export default function VendorMonitorDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; percent?: string; sub?: string; used?: string; days?: string; status?: string }>();

  const percent = Number(params.percent || '65');
  const status = params.status || 'good';
  const ringColor = status === 'good' ? '#18A875' : status === 'low' ? '#D48C18' : '#E44A69';
  const statusLabel = status === 'good' ? 'Good' : status === 'low' ? 'Low' : 'Critical';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
              <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{params.name || 'Office Gas'}</Text>
            <TouchableOpacity style={styles.notificationButton} activeOpacity={0.8}>
              <MaterialCommunityIcons name="bell-outline" size={20} color="#FFFFFF" />
              <View style={styles.notificationBadge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.card}>
          <Text style={styles.cardSub}>{params.sub || 'Main Cylinder'}</Text>

          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{params.name || 'Office Gas'}</Text>
            <View style={[styles.statusPill, { backgroundColor: status === 'good' ? '#CCF3E4' : '#FFF1D6' }]}>
              <Text style={[styles.statusText, { color: ringColor }]}>{statusLabel}</Text>
            </View>
          </View>

          <View style={styles.meterWrap}>
            <View style={[styles.meterOuter, { borderColor: '#E5E7EB' }]}>
              <View style={[styles.meterArc, { borderColor: ringColor, transform: [{ rotate: '-90deg' }] }]} />
              <View style={styles.meterInner}>
                <Text style={styles.fire}>🔥</Text>
                <Text style={styles.percent}>{percent}%</Text>
                <Text style={styles.remaining}>Remaining</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.metricLabel}>Used Today</Text>
              <Text style={styles.metricValue}>{params.used || '2.3 kg'}</Text>
            </View>
            <View>
              <Text style={styles.metricLabel}>Est. Days Left</Text>
              <Text style={styles.metricValue}>{params.days || '12 days'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.refillButton} activeOpacity={0.85}>
            <Text style={styles.refillButtonText}>Schedule Refill</Text>
          </TouchableOpacity>
        </View>
      </View>

      <VendorBottomNav active="monitors" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
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
  sheet: { flex: 1, backgroundColor: '#F3F3F7', paddingHorizontal: 14, paddingTop: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  cardSub: { color: '#99A0AD', fontSize: 8 },
  cardTitleRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: '#161821', fontSize: 30, fontWeight: '700' },
  statusPill: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 9, fontWeight: '600' },
  meterWrap: { marginTop: 10, alignItems: 'center' },
  meterOuter: {
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  meterArc: {
    position: 'absolute',
    width: 126,
    height: 126,
    borderRadius: 63,
    borderWidth: 8,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  meterInner: { alignItems: 'center', justifyContent: 'center' },
  fire: { fontSize: 24 },
  percent: { color: '#171821', fontSize: 39, fontWeight: '700', marginTop: 2 },
  remaining: { color: '#7C7E90', fontSize: 12 },
  divider: { marginTop: 12, height: 1, backgroundColor: '#ECECF2' },
  metricsRow: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  metricLabel: { color: '#9A9BAA', fontSize: 8 },
  metricValue: { marginTop: 2, color: '#1D1E28', fontSize: 23, fontWeight: '700' },
  refillButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#3629B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refillButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
});
