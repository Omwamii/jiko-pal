import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useVendorReviews } from '@/hooks/queries';
import type { Review } from '@/types';

const Stars = ({ count = 5 }: { count?: number }) => {
  return (
    <View style={styles.stars}>
      {Array.from({ length: count }).map((_, index) => (
        <MaterialCommunityIcons key={index} name="star" size={12} color="#FDBA21" />
      ))}
    </View>
  );
};

export default function VendorReviewsScreen() {
  const router = useRouter();
  const { vendorProfile } = useAuth();
  const vendorId = vendorProfile?.id || '';
  
  const { data: reviewsData, isLoading } = useVendorReviews(vendorId);
  const reviews = useMemo(() => reviewsData?.results || [], [reviewsData]);
  
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) dist[r.rating]++; });
    return [5, 4, 3, 2, 1].map((star) => ({
      label: `${star} *`,
      value: dist[star],
      ratio: reviews.length > 0 ? dist[star] / reviews.length : 0,
    }));
  }, [reviews]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
            <Text style={styles.headerTitle}>Reviews</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ratingCard}>
          <Text style={styles.ratingLabel}>Overall Rating</Text>
          
          <View style={styles.overallRow}>
            <Text style={styles.ratingValue}>{averageRating}</Text>
            <View>
              <Stars count={Math.round(parseFloat(averageRating))} />
              <Text style={styles.reviewCount}>{reviews.length} Reviews</Text>
            </View>
          </View>

          <View style={styles.distributionWrap}>
            {ratingDistribution.map((item) => (
              <View key={item.label} style={styles.distRow}>
                <Text style={styles.distLabel}>{item.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.ratio * 100}%` }]} />
                </View>
                <Text style={styles.distValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Reviews</Text>
          {reviews.length > 3 && (
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3629B7" />
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="star-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>Reviews from clients will appear here</Text>
          </View>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <View style={styles.avatarGreen}><Text style={styles.avatarText}>{review.client?.full_name?.charAt(0) || 'C'}</Text></View>
                <View style={styles.reviewMeta}>
                  <Text style={styles.author}>{review.client?.full_name || 'Client'}</Text>
                  <Stars count={review.rating} />
                </View>
              </View>

              <Text style={styles.message}>{review.comment || 'No comment'}</Text>
              <Text style={styles.age}>{getTimeAgo(review.created_at)}</Text>
            </View>
          ))
        )}
      </ScrollView>
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
  headerTitle: { color: '#FFFFFF', fontSize: 30, fontWeight: '600' },
  sheet: { flex: 1, backgroundColor: '#F3F3F7' },
  content: { padding: 14, paddingBottom: 22 },
  ratingCard: {
    backgroundColor: '#3B30B6',
    borderRadius: 10,
    padding: 12,
  },
  ratingLabel: { color: '#DCD9FF', fontSize: 11, fontWeight: '600' },
  overallRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingValue: { color: '#FFFFFF', fontSize: 38, fontWeight: '700' },
  reviewCount: { color: '#C9C4FA', fontSize: 10, marginTop: 2 },
  stars: { flexDirection: 'row', gap: 2 },
  distributionWrap: { marginTop: 8, gap: 5 },
  distRow: { flexDirection: 'row', alignItems: 'center' },
  distLabel: { width: 24, color: '#E7E5FF', fontSize: 10 },
  barTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#ABA4EB', marginHorizontal: 8 },
  barFill: { height: '100%', borderRadius: 2, backgroundColor: '#10B981' },
  distValue: { width: 24, textAlign: 'right', color: '#E7E5FF', fontSize: 10 },
  recentHeader: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  recentTitle: { color: '#20212A', fontSize: 22, fontWeight: '700' },
  viewAll: { color: '#3629B7', fontSize: 10, fontWeight: '600' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 8 },
  emptyText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  emptySubtext: { color: '#9CA3AF', fontSize: 12 },
  reviewCard: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
  },
  reviewTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatarGreen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  reviewMeta: { flex: 1 },
  author: { color: '#1A1B25', fontSize: 16, fontWeight: '600' },
  message: { marginTop: 6, color: '#75788A', fontSize: 10 },
  age: { marginTop: 5, color: '#A0A3B1', fontSize: 8 },
});
