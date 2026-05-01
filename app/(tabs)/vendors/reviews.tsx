import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useReviews } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MaterialCommunityIcons key={n} name={n <= rating ? 'star' : 'star-outline'} size={12} color="#F5B301" />
      ))}
    </View>
  );
}

export default function VendorReviewsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const vendorId = params.vendorId || '';
  const vendorName = useMemo(() => params.vendorName || 'Vendor', [params.vendorName]);

  const { data: reviewsData, isLoading } = useReviews(vendorId ? { 'request__provider_id': vendorId } : undefined);
  const reviews = useMemo(() => reviewsData?.results || [], [reviewsData]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{vendorName} Reviews</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator size="small" color={PRIMARY_COLOR} style={styles.loader} />
        ) : reviews.length === 0 ? (
          <AppCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No reviews yet.</Text>
          </AppCard>
        ) : (
          reviews.map((review: any, index: number) => (
            <AppCard key={review.id} style={[styles.reviewCard, index === reviews.length - 1 && { marginBottom: 0 }]}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.request?.client?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewAuthor}>{review.request?.client?.full_name || 'Anonymous'}</Text>
                  <Stars rating={review.rating} />
                </View>
                <Text style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString()}</Text>
              </View>
              {review.comment && (
                <Text style={styles.reviewComment}>{review.comment}</Text>
              )}
            </AppCard>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingTop: 8, paddingBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 10 },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitle: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  scrollContent: { padding: 12, paddingBottom: 30 },
  loader: { marginTop: 20 },
  emptyCard: { borderRadius: 10, padding: 12 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', fontSize: 14, paddingVertical: 20 },
  reviewCard: { borderRadius: 10, padding: 12, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  reviewInfo: { flex: 1 },
  reviewAuthor: { fontSize: 13, color: '#374151', fontWeight: '700' },
  reviewDate: { color: '#9CA3AF', fontSize: 9 },
  reviewComment: { marginTop: 8, color: '#6B7280', fontSize: 11, lineHeight: 16 },
});
