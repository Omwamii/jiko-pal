import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/lib/api';

const PRIMARY_COLOR = '#3629B7';

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

export default function ClientOrderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    vendorName?: string;
    status?: string;
    scheduledDate?: string;
    completedDate?: string;
    notes?: string;
  }>();

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const status = params.status || 'pending';
  const statusInfo = getStatusStyle(status);
  const orderId = params.orderId || '';

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
          <Text style={styles.detailValue}>{params.vendorName || 'Unknown Vendor'}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Scheduled Date</Text>
          <Text style={styles.detailValue}>
            {params.scheduledDate 
              ? new Date(params.scheduledDate).toLocaleDateString() 
              : 'Not scheduled'}
          </Text>
        </View>

        {params.completedDate && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Completed Date</Text>
            <Text style={styles.detailValue}>
              {new Date(params.completedDate).toLocaleDateString()}
            </Text>
          </View>
        )}

        {params.notes && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{params.notes}</Text>
          </View>
        )}

        {status === 'completed' && !showReviewForm && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => setShowReviewForm(true)}
          >
            <MaterialCommunityIcons name="star-outline" size={16} color="#FFF" />
            <Text style={styles.reviewButtonText}>Leave a Review</Text>
          </TouchableOpacity>
        )}

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
});