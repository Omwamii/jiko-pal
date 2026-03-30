import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const reviews = [
  { id: 'r1', author: 'John Doe', initials: 'JD', rating: 5, text: 'Great service! Fast delivery and professional staff.', age: '2 Days ago' },
  { id: 'r2', author: 'Sarah Kim', initials: 'SK', rating: 4, text: 'Great service! Fast delivery and professional staff.', age: '1 week ago' },
  { id: 'r3', author: 'John Doe', initials: 'JD', rating: 5, text: 'Great service! Fast delivery and professional staff.', age: '2 Days ago' },
  { id: 'r4', author: 'Sarah Kim', initials: 'SK', rating: 4, text: 'Great service! Fast delivery and professional staff.', age: '1 week ago' },
  { id: 'r5', author: 'Sarah Kim', initials: 'SK', rating: 4, text: 'Great service! Fast delivery and professional staff.', age: '1 week ago' },
];

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
  const params = useLocalSearchParams<{ vendorName?: string }>();
  const vendorName = useMemo(() => params.vendorName || 'QuickGas Ltd', [params.vendorName]);

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
        <AppCard style={styles.reviewsCard}>
          {reviews.map((review, index) => (
            <View key={review.id} style={[styles.reviewRow, index === reviews.length - 1 && { marginBottom: 0 }]}>
              <Text style={styles.reviewLabel}>Reviews</Text>
              <View style={styles.itemRow}>
                <View style={[styles.avatar, { backgroundColor: review.initials === 'JD' ? '#4338CA' : '#10B981' }]}>
                  <Text style={styles.avatarText}>{review.initials}</Text>
                </View>
                <View style={styles.body}>
                  <View style={styles.top}>
                    <Text style={styles.author}>{review.author}</Text>
                    <Stars rating={review.rating} />
                  </View>
                  <Text style={styles.text}>{review.text}</Text>
                  <Text style={styles.age}>{review.age}</Text>
                </View>
              </View>
              {index < reviews.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </AppCard>
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
  reviewsCard: { borderRadius: 10, padding: 12 },
  reviewRow: { marginBottom: 10 },
  reviewLabel: { color: '#11181C', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  itemRow: { flexDirection: 'row' },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  body: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { fontSize: 13, color: '#374151', fontWeight: '700' },
  text: { marginTop: 2, color: '#6B7280', fontSize: 10 },
  age: { marginTop: 3, color: '#9CA3AF', fontSize: 9 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginTop: 8 },
});
