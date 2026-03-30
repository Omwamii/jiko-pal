import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const reviews = [
  { id: 'r1', author: 'John Doe', initials: 'JD', rating: 5, text: 'Great service! Fast delivery and professional staff.', age: '2 Days ago' },
  { id: 'r2', author: 'Sarah Kim', initials: 'SK', rating: 4, text: 'Great service! Fast delivery and professional staff.', age: '1 week ago' },
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

export default function VendorDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const [subscribed, setSubscribed] = useState(true);

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
            <Text style={styles.headerTitle}>{vendorName}</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.heroCard}>
          <View style={styles.vendorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SJ</Text>
            </View>
            <View>
              <Text style={styles.vendorName}>{vendorName}</Text>
              <View style={styles.ratingRow}>
                <Stars rating={5} />
                <Text style={styles.reviewedText}>4.8 (2 reviewed)</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Name</Text>
              <Text style={styles.metricValue}>Ksh. 1500</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Current</Text>
              <Text style={styles.metricValue}>Ksh. 1500</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Price now</Text>
              <Text style={[styles.metricValue, { color: '#10B981' }]}>Available Now</Text>
            </View>
          </View>

          <AppButton
            title="Request Refill"
            onPress={() => router.push({ pathname: './refill-select', params: { vendorName } })}
            style={styles.refillBtn}
          />
          <AppButton
            title="Chat with vendor"
            onPress={() => router.push({ pathname: './chat', params: { vendorName } })}
            style={styles.chatBtn}
            textStyle={styles.chatBtnText}
          />
          <AppButton
            title={subscribed ? 'Unsubscribe' : 'Subscribe'}
            onPress={() => setSubscribed((value) => !value)}
            variant="secondary"
            style={styles.subBtn}
            textStyle={[styles.subText, !subscribed && styles.subTextSubscribed]}
          />
        </AppCard>

        <Text style={styles.sectionTitle}>About</Text>
        <AppCard style={styles.sectionCard}>
          <Text style={styles.aboutText}>
            {vendorName} Ltd is a trusted gas provider serving the local community with fast, reliable service.
            We ensure quality gas cylinders and timely deliveries to keep your home or business running smoothly.
          </Text>
        </AppCard>

        <Text style={styles.sectionTitle}>Contact Information</Text>
        <AppCard style={styles.sectionCard}>
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="phone" size={14} color={PRIMARY_COLOR} />
            </View>
            <View>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+254 712435730</Text>
            </View>
          </View>
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="email-outline" size={14} color="#10B981" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>contact@quickgasltd.com</Text>
            </View>
          </View>
          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <View style={[styles.contactIcon, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#8B5CF6" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>456 Commerce St, City Center</Text>
            </View>
          </View>
        </AppCard>

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: './reviews', params: { vendorName } })}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <AppCard style={styles.sectionCard}>
          {reviews.map((review, index) => (
            <View key={review.id} style={[styles.reviewRow, index === reviews.length - 1 && { marginBottom: 0 }]}>
              <View style={[styles.reviewAvatar, { backgroundColor: '#4338CA' }]}>
                <Text style={styles.reviewAvatarText}>{review.initials}</Text>
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewAuthor}>{review.author}</Text>
                  <Stars rating={review.rating} />
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewAge}>{review.age}</Text>
              </View>
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
  heroCard: { borderRadius: 14, marginBottom: 10, padding: 12 },
  vendorRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  vendorName: { fontSize: 16, color: '#11181C', fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  reviewedText: { marginLeft: 6, color: '#9CA3AF', fontSize: 10 },
  metricsRow: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
  metricCol: { flex: 1 },
  metricLabel: { color: '#9CA3AF', fontSize: 9 },
  metricValue: { marginTop: 2, color: '#11181C', fontSize: 13, fontWeight: '700' },
  refillBtn: { marginBottom: 8 },
  chatBtn: { backgroundColor: '#10B981', marginBottom: 8 },
  chatBtnText: { color: '#FFFFFF' },
  subBtn: { backgroundColor: '#FFFFFF', borderColor: '#FCA5A5' },
  subText: { color: '#EF4444' },
  subTextSubscribed: { color: '#10B981' },
  sectionTitle: { fontSize: 14, color: '#11181C', fontWeight: '700', marginBottom: 6, marginTop: 4 },
  sectionCard: { padding: 12, borderRadius: 10, marginBottom: 10 },
  aboutText: { color: '#6B7280', fontSize: 11, lineHeight: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  contactIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  contactLabel: { color: '#9CA3AF', fontSize: 9 },
  contactValue: { color: '#374151', fontSize: 12, fontWeight: '600' },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: PRIMARY_COLOR, fontWeight: '700', fontSize: 10 },
  reviewRow: { flexDirection: 'row', marginBottom: 12 },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  reviewAvatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  reviewBody: { flex: 1 },
  reviewTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewAuthor: { fontSize: 13, color: '#374151', fontWeight: '700' },
  reviewText: { marginTop: 2, color: '#6B7280', fontSize: 10 },
  reviewAge: { marginTop: 3, color: '#9CA3AF', fontSize: 9 },
});
