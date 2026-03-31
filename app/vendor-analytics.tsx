import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';

type TimeFilter = 'all' | 'week' | 'month' | 'year';

const timeFilters: Array<{ key: TimeFilter; label: string }> = [
  { key: 'all', label: 'AllTime' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
];

const ratingBreakdown = [
  { label: '5 *', value: 220, ratio: 0.9 },
  { label: '4 *', value: 45, ratio: 0.45 },
  { label: '3 *', value: 15, ratio: 0.25 },
  { label: '2 *', value: 6, ratio: 0.15 },
  { label: '1 *', value: 3, ratio: 0.07 },
];

export default function VendorAnalyticsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
                <MaterialCommunityIcons name="arrow-left" size={18} color="#FFFFFF" />
              </TouchableOpacity>
              <View>
                <Text style={styles.headerTitle}>Analytics</Text>
                <Text style={styles.headerSub}>Performance insights</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.markAllButton} activeOpacity={0.85}>
              <Text style={styles.markAllText}>Mark All read</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.sheet}>
        <View style={styles.filterRow}>
          {timeFilters.map((item) => {
            const active = item.key === activeFilter;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                activeOpacity={0.85}
                onPress={() => setActiveFilter(item.key)}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={12} color="#3629B7" />
              </View>
              <Text style={styles.statLabel}>Total Orders</Text>
              <Text style={styles.statValue}>12</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#D9F8EA' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={12} color="#18A875" />
              </View>
              <Text style={styles.statLabel}>Cylinders</Text>
              <Text style={styles.statValue}>2</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Product Breakdown</Text>

          <View style={styles.productCard}>
            <View style={styles.productTopRow}>
              <View style={styles.productLeft}>
                <View style={styles.dropIconWrap}><MaterialCommunityIcons name="water" size={15} color="#18A875" /></View>
                <View>
                  <Text style={styles.productName}>6kg</Text>
                  <Text style={styles.productSub}>18 Units sold</Text>
                </View>
              </View>
              <Text style={styles.percentText}>27%</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '78%', backgroundColor: '#4238C9' }]} /></View>
          </View>

          <View style={styles.productCard}>
            <View style={styles.productTopRow}>
              <View style={styles.productLeft}>
                <View style={styles.dropIconWrap}><MaterialCommunityIcons name="water" size={15} color="#18A875" /></View>
                <View>
                  <Text style={styles.productName}>13kg</Text>
                  <Text style={styles.productSub}>18 Units sold</Text>
                </View>
              </View>
              <Text style={styles.percentText}>27%</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '78%', backgroundColor: '#F59E0B' }]} /></View>
          </View>

          <View style={styles.productCard}>
            <View style={styles.productTopRow}>
              <View style={styles.productLeft}>
                <View style={styles.dropIconWrap}><MaterialCommunityIcons name="water" size={15} color="#18A875" /></View>
                <View>
                  <Text style={styles.productName}>50kg</Text>
                  <Text style={styles.productSub}>18 Units sold</Text>
                </View>
              </View>
              <Text style={styles.percentText}>27%</Text>
            </View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: '78%', backgroundColor: '#10B981' }]} /></View>
          </View>

          <Text style={styles.sectionTitle}>Customer Satisfaction</Text>
          <View style={styles.satisfactionCard}>
            <Text style={styles.ratingLabel}>Overall Rating</Text>

            <View style={styles.ratingRow}>
              <Text style={styles.ratingValue}>4.8</Text>
              <View>
                <View style={styles.starsRow}>
                  <MaterialCommunityIcons name="star" size={11} color="#FBBF24" />
                  <MaterialCommunityIcons name="star" size={11} color="#FBBF24" />
                  <MaterialCommunityIcons name="star" size={11} color="#FBBF24" />
                  <MaterialCommunityIcons name="star" size={11} color="#FBBF24" />
                  <MaterialCommunityIcons name="star-outline" size={11} color="#FBBF24" />
                </View>
                <Text style={styles.reviewCount}>389 Reviews</Text>
              </View>
            </View>

            <View style={styles.breakdownWrap}>
              {ratingBreakdown.map((item) => (
                <View key={item.label} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>{item.label}</Text>
                  <View style={styles.breakdownTrack}>
                    <View style={[styles.breakdownFill, { width: `${item.ratio * 100}%` }]} />
                  </View>
                  <Text style={styles.breakdownValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      <VendorBottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3629B7' },
  header: { backgroundColor: '#3629B7' },
  safeHeader: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 8,
  },
  headerTitle: { color: '#FFFFFF', fontSize: 33, fontWeight: '700' },
  headerSub: { color: '#D6D3FA', fontSize: 9, marginTop: 1 },
  markAllButton: {
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.24)',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  markAllText: { color: '#ECECF9', fontSize: 8, fontWeight: '600' },
  sheet: {
    flex: 1,
    backgroundColor: '#F3F3F7',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  filterPill: {
    flex: 1,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#E9E8F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1E3EC',
  },
  filterPillActive: { backgroundColor: '#6E63D9', borderColor: '#6E63D9' },
  filterText: { color: '#6D6E80', fontSize: 8, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF', fontWeight: '600' },
  content: { padding: 14, paddingBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
  },
  statIconWrap: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E8E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { marginTop: 5, color: '#8E8FA1', fontSize: 8 },
  statValue: { marginTop: 3, color: '#151620', fontSize: 30, fontWeight: '700' },
  sectionTitle: { marginTop: 14, marginBottom: 8, color: '#171923', fontSize: 30, fontWeight: '700' },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    marginBottom: 8,
  },
  productTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productLeft: { flexDirection: 'row', alignItems: 'center' },
  dropIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D9F8EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  productName: { color: '#151620', fontSize: 13, fontWeight: '700' },
  productSub: { color: '#8D8EA0', fontSize: 8, marginTop: 1 },
  percentText: { color: '#171923', fontSize: 12, fontWeight: '600' },
  progressTrack: {
    marginTop: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 2 },
  satisfactionCard: {
    backgroundColor: '#3B30B6',
    borderRadius: 10,
    padding: 12,
  },
  ratingLabel: { color: '#DDD9FF', fontSize: 10, fontWeight: '600' },
  ratingRow: { marginTop: 2, flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingValue: { color: '#FFFFFF', fontSize: 40, fontWeight: '700' },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewCount: { marginTop: 2, color: '#C9C4FA', fontSize: 8 },
  breakdownWrap: { marginTop: 8, gap: 5 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center' },
  breakdownLabel: { width: 24, color: '#E7E5FF', fontSize: 9 },
  breakdownTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#A8A2E8',
    marginHorizontal: 7,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#10B981',
  },
  breakdownValue: { width: 23, color: '#E7E5FF', fontSize: 8, textAlign: 'right' },
});
