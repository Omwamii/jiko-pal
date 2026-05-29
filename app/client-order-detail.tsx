import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { refillRequestService } from '@/lib/refill';
import type { PaginatedResponse, Review, RefillRequest } from '@/types';
import { formatDate } from '@/lib/utils';

const PRIMARY_COLOR = '#3629B7';

const formatDistance = (distanceKm: number) => {
  if (distanceKm < 1) {
    const meters = distanceKm * 1000;
    const roundedMeters = meters < 10 ? Math.round(meters * 10) / 10 : Math.round(meters);
    return `${roundedMeters} m`;
  }

  const roundedKm = distanceKm < 10 ? Math.round(distanceKm * 10) / 10 : Math.round(distanceKm);
  return `${roundedKm} km`;
};

function getStatusStyle(status: string) {
  if (status === 'pending') {
    return { backgroundColor: '#F6E6C9', color: '#D48C18', label: 'Pending' };
  }
  if (status === 'completed') {
    return { backgroundColor: '#D1FAE5', color: '#10B981', label: 'Completed' };
  }
  if (status === 'cancelled') {
    return { backgroundColor: '#F9CDD4', color: '#E44A69', label: 'Cancelled' };
  }
  return { backgroundColor: '#E9E6FF', color: '#6B5DD9', label: 'In Progress' };
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <MaterialCommunityIcons key={n} name={n <= rating ? 'star' : 'star-outline'} size={14} color="#F59E0B" />
      ))}
    </View>
  );
}

export default function ClientOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    vendorName?: string;
    vendorId?: string;
    vendorPhone?: string;
    status?: string;
    scheduledDate?: string;
    completedDate?: string;
    notes?: string;
  }>();
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const orderId = params.orderId || '';

  const { data: orderDetails } = useQuery({
    queryKey: ['refillRequest', orderId],
    enabled: !!orderId,
    queryFn: async (): Promise<RefillRequest> => {
      return refillRequestService.getRefillRequest(orderId);
    },
  });

  const status = params.status || orderDetails?.status || 'pending';
  const statusInfo = getStatusStyle(status);
  const vendorName = params.vendorName || orderDetails?.provider?.company_name || 'Unknown Vendor';
  const vendorId = params.vendorId || orderDetails?.provider?.id || undefined;
  const vendorPhone =
    params.vendorPhone || orderDetails?.provider?.primary_phone || orderDetails?.provider?.alternate_phone || undefined;
  const scheduledDate = params.scheduledDate || orderDetails?.scheduled_date || undefined;
  const completedDate = params.completedDate || orderDetails?.completed_at || undefined;
  const notes = params.notes || orderDetails?.notes || undefined;

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const canContact = !isCompleted && !isCancelled;

  const vendorDistanceKm = orderDetails?.provider?.distance_km;

  const handleCall = () => {
    if (vendorPhone) {
      Linking.openURL(`tel:${vendorPhone}`);
    } else {
      Alert.alert('Error', 'Vendor phone number not available');
    }
  };

  const handleChat = () => {
    if (vendorId && vendorId !== '') {
      router.push({
        pathname: '/vendor-chat',
        params: { vendorId, vendorName }
      } as Href);
    } else {
      Alert.alert('Error', 'Vendor information not available');
    }
  };

  const { data: reviewResponse } = useQuery({
    queryKey: ['reviewForRequest', orderId],
    enabled: status === 'completed' && !!orderId,
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Review>>('/reviews/', { params: { request: orderId } });
      return res.data;
    },
  });

  const existingReview = useMemo(() => reviewResponse?.results?.[0] || null, [reviewResponse]);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!orderId) {
      Alert.alert('Error', 'Order not found');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/reviews/', {
        request: orderId,
        rating: rating,
        comment: reviewText,
      });
      Alert.alert('Success', 'Review submitted successfully');
      setShowReviewForm(false);
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statusCard}>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
          </View>
          <Text style={styles.orderId}>#{orderId.slice(-8).toUpperCase()}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Vendor</Text>
          <Text style={styles.detailValue}>{vendorName}</Text>
        </View>

        {status === 'in_transit' && typeof vendorDistanceKm === 'number' ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Vendor distance</Text>
            <Text style={styles.detailValue}>{formatDistance(vendorDistanceKm)} away</Text>
          </View>
        ) : null}

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Scheduled Date</Text>
          <Text style={styles.detailValue}>
            {scheduledDate
              ? formatDate(scheduledDate)
              : 'Not scheduled'}
          </Text>
        </View>

        {completedDate && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Completed Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(completedDate)}
            </Text>
          </View>
        )}

        {notes && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{notes}</Text>
          </View>
        )}

        {isCancelled && orderDetails?.cancellation_reason ? (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Cancellation Reason</Text>
            <Text style={styles.detailValue}>{orderDetails.cancellation_reason}</Text>
          </View>
        ) : null}

        {canContact && (
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.8}>
              <MaterialCommunityIcons name="phone" size={18} color="#16A34A" />
              <Text style={styles.callButtonText}>Call Vendor</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.chatButton} onPress={handleChat} activeOpacity={0.8}>
              <MaterialCommunityIcons name="message-outline" size={18} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>Chat with Vendor</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'completed' && !showReviewForm && existingReview ? (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>Your Review</Text>
              <Stars rating={existingReview.rating} />
            </View>
            <Text style={styles.reviewDate}>
              {formatDate(existingReview.created_at)}
            </Text>
            <Text style={styles.reviewComment}>
              {existingReview.comment?.trim() ? existingReview.comment : 'No comment provided.'}
            </Text>
          </View>
        ) : status === 'completed' && !showReviewForm ? (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => setShowReviewForm(true)}
          >
            <MaterialCommunityIcons name="star-outline" size={16} color="#FFF" />
            <Text style={styles.reviewButtonText}>Leave a Review</Text>
          </TouchableOpacity>
        ) : null}

        <Modal
          visible={showReviewForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowReviewForm(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Leave a Review</Text>
                <TouchableOpacity 
                  style={styles.modalCloseBtn}
                  onPress={() => setShowReviewForm(false)}
                >
                  <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.reviewFormTitle}>Rate your experience</Text>
              
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                  >
                    <MaterialCommunityIcons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={40}
                      color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.reviewInput}
                placeholder="Write your review (optional)"
                placeholderTextColor="#9CA3AF"
                value={reviewText}
                onChangeText={setReviewText}
                multiline
                numberOfLines={4}
              />

              <View style={styles.reviewActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowReviewForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: PRIMARY_COLOR, paddingBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
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
  scrollContent: { padding: 14, paddingBottom: 30 },
  statusCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewTitle: { color: '#11181C', fontSize: 14, fontWeight: '700' },
  reviewDate: { color: '#9CA3AF', fontSize: 10, marginTop: 6 },
  reviewComment: { color: '#374151', fontSize: 12, marginTop: 8, lineHeight: 18 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderId: { color: '#9CA3AF', fontSize: 12 },
  detailCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  detailLabel: { color: '#9CA3AF', fontSize: 10, marginBottom: 4 },
  detailValue: { color: '#11181C', fontSize: 14, fontWeight: '600' },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  reviewButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  reviewForm: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  reviewFormTitle: { color: '#11181C', fontSize: 14, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    color: '#374151',
    fontSize: 12,
    marginBottom: 12,
  },
  reviewActions: { flexDirection: 'row', gap: 10 },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: { color: '#6B7280', fontSize: 12, fontWeight: '600' },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
  },
  submitButtonText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
  },
  modalCloseBtn: {
    padding: 4,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 10,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  callButtonText: {
    color: '#16A34A',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
