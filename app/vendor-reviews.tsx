import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Review = {
  id: string;
  initials: string;
  author: string;
  message: string;
  age: string;
};

const reviews: Review[] = [
  { id: 'r-1', initials: 'SK', author: '', message: 'Great service! Fast delivery and professional staff.', age: '1 week ago' },
  { id: 'r-2', initials: 'JD', author: 'John Doe', message: 'Great service! Fast delivery and professional staff.', age: '2 days ago' },
  { id: 'r-3', initials: 'JD', author: 'John Doe', message: 'Great service! Fast delivery and professional staff.', age: '2 days ago' },
];

const distribution = [
  { label: '5 *', value: 220, ratio: 0.92 },
  { label: '4 *', value: 45, ratio: 0.52 },
  { label: '3 *', value: 15, ratio: 0.32 },
  { label: '2 *', value: 6, ratio: 0.18 },
  { label: '1 *', value: 3, ratio: 0.1 },
];

function Stars({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: count }).map((_, index) => (
        <MaterialCommunityIcons key={index} name="star" size={12} color="#FDBA21" />
      ))}
    </View>
  );
}

export default function VendorReviewsScreen() {
  const router = useRouter();

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
            <Text style={styles.ratingValue}>4.8</Text>
            <View>
              <Stars />
              <Text style={styles.reviewCount}>389 Reviews</Text>
            </View>
          </View>

          <View style={styles.distributionWrap}>
            {distribution.map((item) => (
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
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.highlightCard}>
          <View style={styles.reviewTop}>
            <View style={styles.avatarGreen}><Text style={styles.avatarText}>SK</Text></View>
            <Stars />
          </View>
          <Text style={styles.message}>Great service! Fast delivery and professional staff.</Text>
          <Text style={styles.age}>1 week ago</Text>

          <View style={styles.replyCard}>
            <View style={styles.reviewTop}>
              <MaterialCommunityIcons name="reply-outline" size={14} color="#5E5FAF" />
              <Text style={styles.replyTitle}>Your Reply</Text>
            </View>
            <Text style={styles.replyText}>Thank you so much for your kind words! We’re thrilled you had a great experience.</Text>
            <Text style={styles.age}>2 days ago</Text>
          </View>
        </View>

        {reviews.slice(1).map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.avatarPurple}><Text style={styles.avatarText}>{review.initials}</Text></View>
              <Text style={styles.author}>{review.author}</Text>
              <View style={{ marginLeft: 'auto' }}><Stars /></View>
            </View>

            <Text style={styles.message}>{review.message}</Text>
            <Text style={styles.age}>{review.age}</Text>

            <TouchableOpacity style={styles.replyButton} activeOpacity={0.85}>
              <MaterialCommunityIcons name="message-reply-outline" size={15} color="#5E5FAF" />
              <Text style={styles.replyButtonText}>Reply to Review</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  highlightCard: {
    marginTop: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5DA6E5',
    borderRadius: 3,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  reviewCard: {
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECF3',
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
  avatarPurple: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  author: { color: '#1A1B25', fontSize: 16, fontWeight: '600' },
  message: { marginTop: 6, color: '#75788A', fontSize: 10 },
  age: { marginTop: 5, color: '#A0A3B1', fontSize: 8 },
  replyCard: {
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8E8EEA',
    backgroundColor: '#F5F4FF',
    padding: 8,
  },
  replyTitle: { color: '#5E5FAF', fontSize: 10, fontWeight: '700' },
  replyText: { marginTop: 4, color: '#7D7FB0', fontSize: 9 },
  replyButton: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#D9D6EF',
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  replyButtonText: { color: '#5E5FAF', fontSize: 10, fontWeight: '600' },
});
