import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { useVendorDetails, useSubscribeVendor, useUnsubscribeVendor, useVendorSubscriptions } from '@/hooks/vendor';
import { useCatalogueByVendor, useReviews } from '@/hooks/queries';
import { formatDate } from '@/lib/utils';

const PRIMARY_COLOR = '#3629B7';

export default function VendorDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string }>();
  const vendorId = params.vendorId || '';
  
  const { vendor, fetchVendor } = useVendorDetails();
  const { subscriptions, fetchSubscriptions } = useVendorSubscriptions();
  const { subscribe, isLoading: isSubscribing } = useSubscribeVendor();
  const { unsubscribe, isLoading: isUnsubscribing } = useUnsubscribeVendor();
  const { data: catalogue = [], isLoading: catalogueLoading } = useCatalogueByVendor(vendorId);
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(vendorId ? { 'request__provider_id': vendorId } : undefined);

  const vendorName = useMemo(() => params.vendorName || vendor?.company_name || 'Vendor', [params.vendorName, vendor]);
  
  const isSubscribed = useMemo(() => {
    return subscriptions.some(sub => sub.vendor.id === vendorId);
  }, [subscriptions, vendorId]);

  const reviews = useMemo(() => reviewsData?.results || [], [reviewsData]);
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round(sum / reviews.length * 10) / 10;
  }, [reviews]);
  const displayedAvgRating = typeof vendor?.avg_rating === 'number' ? vendor.avg_rating : avgRating;
  const displayedReviewCount = reviews.length;

  useEffect(() => {
    if (vendorId) {
      fetchVendor(vendorId);
      fetchSubscriptions();
    }
  }, [vendorId, fetchVendor, fetchSubscriptions]);

  const handleSubscribeToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribe(vendorId);
        Alert.alert('Success', 'You have unsubscribed from this vendor.');
      } else {
        await subscribe(vendorId);
        Alert.alert('Success', 'You have subscribed to this vendor!');
      }
      fetchSubscriptions();
    } catch (err) {
      Alert.alert('Error', 'Failed to update subscription. Please try again.');
    }
  };

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
                <Stars rating={displayedAvgRating} />
                <Text style={styles.reviewedText}>{displayedAvgRating} ({displayedReviewCount} reviews)</Text>
                {typeof vendor?.distance_km === 'number' ? (
                  <>
                    <Text style={styles.reviewedDot}>•</Text>
                    <MaterialCommunityIcons name="map-marker-radius-outline" size={14} color="#6B7280" />
                    <Text style={styles.distanceText}>{vendor.distance_km.toFixed(1)} km away</Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Name</Text>
              <Text style={styles.metricValue}>{vendor?.company_name}</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Location</Text>
              <Text style={styles.metricValue}>{vendor?.location || vendor?.county}</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Availability</Text>
              <Text style={[styles.metricValue, { color: vendor?.is_available ? '#10B981' : '#EF4444' }]}>
                {vendor?.is_available ? 'Available' : 'Unavailable'}
              </Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Distance</Text>
              <Text style={styles.metricValue}>
                {typeof vendor?.distance_km === 'number' ? `${vendor.distance_km.toFixed(1)} km` : '—'}
              </Text>
            </View>
          </View>

          <AppButton
            title="Request Refill"
            onPress={() => router.push({ pathname: '/(tabs)/vendors/catalogue-select', params: { vendorId, vendorName } } as Href)}
            style={styles.refillBtn}
          />
          <AppButton
            title="Chat with vendor"
            onPress={() => router.push({ pathname: '/(tabs)/vendors/chat', params: { vendorId, vendorName } } as Href)}
            style={styles.chatBtn}
            textStyle={styles.chatBtnText}
          />
          <AppButton
            title={isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            onPress={handleSubscribeToggle}
            variant="secondary"
            style={styles.subBtn}
            textStyle={[styles.subText, !isSubscribed && styles.subTextSubscribed]}
            loading={isSubscribing || isUnsubscribing}
          />
        </AppCard>

        <Text style={styles.sectionTitle}>Available Cylinders</Text>
        {catalogueLoading ? (
          <AppCard style={styles.sectionCard}>
            <Text style={styles.emptyText}>Loading catalogue...</Text>
          </AppCard>
        ) : catalogue.length === 0 ? (
          <AppCard style={styles.sectionCard}>
            <Text style={styles.emptyText}>No cylinders available at the moment.</Text>
          </AppCard>
        ) : (
          catalogue.map((item) => (
            <AppCard key={item.id} style={styles.catalogueCard}>
              {item.picture_url && (
                <Image source={{ uri: item.picture_url }} style={styles.catalogueImage} />
              )}
              <View style={styles.catalogueContent}>
                <View style={styles.catalogueHeader}>
                  <Text style={styles.catalogueTitle}>{item.cylinder_company} {Math.floor(item.size)} Kg</Text>
                  {item.is_available ? (
                    <View style={styles.availableBadge}>
                      <Text style={styles.availableText}>In Stock</Text>
                    </View>
                  ) : (
                    <View style={styles.unavailableBadge}>
                      <Text style={styles.unavailableText}>Out of Stock</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cataloguePrice}>KES {item.price}</Text>
                <TouchableOpacity
                  style={[styles.requestBtn, !item.is_available && styles.requestBtnDisabled]}
                  onPress={() => {
                    if (item.is_available) {
                      router.push({
                        pathname: '/(tabs)/vendors/refill-select',
                        params: { vendorId, vendorName, catalogueId: item.id }
                      } as Href);
                    }
                  }}
                  disabled={!item.is_available}
                >
                  <Text style={styles.requestBtnText}>Request This Cylinder</Text>
                </TouchableOpacity>
              </View>
            </AppCard>
          ))
        )}

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
              <Text style={styles.contactLabel}>Primary Phone</Text>
              <Text style={styles.contactValue}>{vendor?.primary_phone}</Text>
            </View>
            {vendor?.alternate_phone && (
              <View>
                <Text style={styles.contactLabel}>Secondary Phone</Text>
                <Text style={styles.contactValue}>{vendor?.primary_phone}</Text>
              </View>
            )}
          </View>
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: '#D1FAE5' }]}>
              <MaterialCommunityIcons name="email-outline" size={14} color="#10B981" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{vendor?.user.email}</Text>
            </View>
          </View>
          <View style={[styles.contactRow, { marginBottom: 0 }]}>
            <View style={[styles.contactIcon, { backgroundColor: '#E0E7FF' }]}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#8B5CF6" />
            </View>
            <View>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{vendor?.street_address}</Text>
            </View>
          </View>

          {vendor?.website && (
            <View style={styles.contactRow}>
              <View style={[styles.contactIcon, { backgroundColor: '#E0E7FF' }]}>
                <MaterialCommunityIcons name="globe-light" size={14} color={PRIMARY_COLOR} />
              </View>
              <View>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>{vendor?.website}</Text>
              </View>
            </View>
          )}
        </AppCard>

        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews {reviews.length > 0 && `(${reviews.length})`}</Text>
          {reviews.length > 3 && (
            <TouchableOpacity onPress={() => router.push({ pathname: '/(tabs)/vendors/reviews', params: { vendorId, vendorName } } as Href)}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          )}
        </View>
        {reviewsLoading ? (
          <ActivityIndicator size="small" color={PRIMARY_COLOR} />
        ) : reviews.length === 0 ? (
          <AppCard style={styles.sectionCard}>
            <Text style={styles.emptyText}>No reviews yet.</Text>
          </AppCard>
        ) : (
          reviews.slice(0, 3).map((review: any) => (
            <AppCard key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>
                    {review.request?.client?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                  </Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewAuthor}>{review.request?.client?.full_name || 'Anonymous'}</Text>
                  <Stars rating={review.rating} />
                </View>
                <Text style={styles.reviewDate}>{formatDate(review.created_at)}</Text>
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

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MaterialCommunityIcons key={n} name={n <= rating ? 'star' : 'star-outline'} size={12} color="#F5B301" />
      ))}
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
  reviewedDot: { marginHorizontal: 6, color: '#D1D5DB', fontSize: 10 },
  distanceText: { marginLeft: 4, color: '#6B7280', fontSize: 10, fontWeight: '600' },
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
  reviewCard: { padding: 12, borderRadius: 10, marginBottom: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  reviewAvatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  reviewInfo: { flex: 1 },
  reviewAuthor: { fontSize: 13, color: '#374151', fontWeight: '700' },
  reviewDate: { color: '#9CA3AF', fontSize: 9 },
  reviewComment: { marginTop: 8, color: '#6B7280', fontSize: 11, lineHeight: 16 },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    paddingVertical: 20,
  },
  catalogueCard: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  catalogueImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  catalogueContent: {
    padding: 12,
  },
  catalogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  catalogueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#10B981',
  },
  unavailableBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  unavailableText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#EF4444',
  },
  cataloguePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 8,
  },
  requestBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  requestBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  requestBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
