import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { VendorBottomNav } from '@/components/vendor/VendorBottomNav';
import { useVendorAnalytics } from '@/hooks/queries';
import type { VendorAnalyticsRatingBreakdownRow, VendorAnalyticsPeriod } from '@/types';

type TimeFilter = VendorAnalyticsPeriod;

const timeFilters: Array<{ key: TimeFilter; label: string }> = [
  { key: 'all', label: 'All time' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
];

export default function VendorAnalyticsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<TimeFilter>('all');
  const { data, isLoading, isError } = useVendorAnalytics(activeFilter);

  const ratingBreakdown = useMemo(() => {
    const breakdown = data?.satisfaction?.breakdown ?? [];
    const asMap = new Map<number, VendorAnalyticsRatingBreakdownRow>();
    for (const row of breakdown) asMap.set(row.rating, row);

    return [5, 4, 3, 2, 1].map((rating) => {
      const row = asMap.get(rating);
      return {
        label: `${rating} *`,
        value: row?.count ?? 0,
        ratio: row?.ratio ?? 0,
      };
    });
  }, [data?.satisfaction?.breakdown]);

  const totals = data?.totals;
  const productBreakdown = data?.product_breakdown ?? [];
  const avgRating = data?.satisfaction?.avg_rating ?? 0;

  const starIcons = useMemo(() => {
    const icons: Array<'star' | 'star-half-full' | 'star-outline'> = [];
    const clamped = Math.max(0, Math.min(5, avgRating));
    const full = Math.floor(clamped);
    const hasHalf = clamped - full >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) icons.push('star');
      else if (i === full && hasHalf) icons.push('star-half-full');
      else icons.push('star-outline');
    }
    return icons;
  }, [avgRating]);

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

        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#3629B7" />
          </View>
        ) : isError ? (
          <View style={styles.loadingWrap}>
            <Text style={styles.errorText}>Unable to load analytics right now.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={12} color="#3629B7" />
              </View>
              <Text style={styles.statLabel}>Total Orders</Text>
              <Text style={styles.statValue}>{totals?.total_orders ?? 0}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#D9F8EA' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={12} color="#18A875" />
              </View>
              <Text style={styles.statLabel}>Cylinders</Text>
              <Text style={styles.statValue}>{totals?.products_sold ?? 0}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Product Breakdown</Text>

          {productBreakdown.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No orders in this period.</Text>
            </View>
          ) : (
            productBreakdown.map((row, idx) => {
              const percent = Math.round((row.ratio ?? 0) * 100);
              const palette = ['#4238C9', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];
              const color = palette[idx % palette.length];
              return (
                <View key={`${row.label}-${idx}`} style={styles.productCard}>
                  <View style={styles.productTopRow}>
                    <View style={styles.productLeft}>
                      <View style={styles.dropIconWrap}>
                        <MaterialCommunityIcons name="water" size={15} color="#18A875" />
                      </View>
                      <View>
                        <Text style={styles.productName}>{row.label}</Text>
                        <Text style={styles.productSub}>{row.units_sold} Units sold</Text>
                      </View>
                    </View>
                    <Text style={styles.percentText}>{percent}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: color }]} />
                  </View>
                </View>
              );
            })
          )}

        <Text style={styles.sectionTitle}>Customer Satisfaction</Text>
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => router.push('/vendor-reviews' as Href)}
          style={styles.satisfactionCard}>
          <Text style={styles.ratingLabel}>Overall Rating</Text>
          
          <View style={styles.ratingRow}>
            <Text style={styles.ratingValue}>{avgRating.toFixed(1)}</Text>
            <View>
              <View style={styles.starsRow}>
                {starIcons.map((name, idx) => (
                  <MaterialCommunityIcons key={`${name}-${idx}`} name={name} size={11} color="#FBBF24" />
                ))}
              </View>
              <Text style={styles.reviewCount}>{data?.satisfaction?.total_reviews ?? 0} Reviews</Text>
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
         </TouchableOpacity>
         </ScrollView>
        )}
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
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 30 },
  errorText: { color: '#6D6E80', fontSize: 12 },
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
  sectionTitle: { marginTop: 14, marginBottom: 8, color: '#171923', fontSize: 20, fontWeight: '700' },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 10,
    marginBottom: 8,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ECECF3',
    padding: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  emptyText: { color: '#8E8FA1', fontSize: 12 },
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
