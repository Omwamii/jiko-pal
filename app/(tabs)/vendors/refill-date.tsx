import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { useCreateRefillRequest } from '@/hooks/refill';

const PRIMARY_COLOR = '#3629B7';

const days = [27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

export default function RefillDateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorId?: string; vendorName?: string; cylinderName?: string; cylinderLevel?: string }>();
  const vendorName = useMemo(() => params.vendorName || 'Quick Gas', [params.vendorName]);
  const cylinderName = useMemo(() => params.cylinderName || 'Kitchen Gas', [params.cylinderName]);
  const vendorId = params.vendorId;
  const [selectedDay, setSelectedDay] = useState(6);
  
  const { createRequest, isLoading, error } = useCreateRefillRequest();

  const handleConfirmOrder = async () => {
    if (!vendorId) {
      Alert.alert('Error', 'Missing vendor information');
      return;
    }

    try {
      const scheduledDate = new Date(2026, 0, selectedDay).toISOString().split('T')[0];
      
      await createRequest({
        provider_id: vendorId,
        device_id: undefined,
        scheduled_date: scheduledDate,
        notes: `Refill for ${cylinderName}`,
      });

      router.replace({
        pathname: '/(tabs)/vendors/refill-success',
        params: { vendorName, cylinderName },
      } as Href);
    } catch (err) {
      Alert.alert('Error', error || 'Failed to create refill request');
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
            <Text style={styles.headerTitle}>Request Refill</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Pick Delivery Date*</Text>
        <AppCard style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Text style={styles.monthText}>December 2026</Text>
            <View style={styles.chevronWrap}>
              <MaterialCommunityIcons name="chevron-left" size={16} color="#D1D5DB" />
              <MaterialCommunityIcons name="chevron-right" size={16} color="#D1D5DB" />
            </View>
          </View>

          <View style={styles.daysHeader}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
              <Text key={idx} style={styles.dayLabel}>
                {d}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {days.map((day, index) => {
              const selected = day === selectedDay && index > 4;
              return (
                <TouchableOpacity key={`${day}-${index}`} style={styles.dayCell} onPress={() => setSelectedDay(day)}>
                  <View style={[styles.dayCircle, selected && styles.dayCircleSelected]}>
                    <Text style={[styles.dayNum, selected && styles.dayNumSelected]}>{day}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Cylinder:</Text>
            <Text style={styles.summaryValue}>{cylinderName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vendor:</Text>
            <Text style={styles.summaryValue}>{vendorName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={[styles.summaryValue, { color: PRIMARY_COLOR }]}>{selectedDay}th Jan</Text>
          </View>
        </AppCard>

        <AppButton
          title={isLoading ? 'Confirming...' : 'Confirm Order'}
          onPress={handleConfirmOrder}
          disabled={isLoading}
        />
        {isLoading && (
          <ActivityIndicator size="small" color={PRIMARY_COLOR} style={styles.loader} />
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
  scrollContent: { padding: 14, paddingBottom: 30 },
  sectionTitle: { color: '#11181C', fontSize: 14, fontWeight: '700', marginBottom: 10 },
  calendarCard: { borderRadius: 8, padding: 12, marginBottom: 12 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  monthText: { color: '#9CA3AF', fontSize: 12, fontWeight: '600' },
  chevronWrap: { flexDirection: 'row', width: 40, justifyContent: 'space-between' },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  dayLabel: { color: '#D1D5DB', fontSize: 11, width: 28, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', alignItems: 'center', marginVertical: 2 },
  dayCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dayCircleSelected: { backgroundColor: PRIMARY_COLOR },
  dayNum: { color: '#6B7280', fontSize: 12 },
  dayNumSelected: { color: '#FFFFFF', fontWeight: '700' },
  summaryCard: { borderRadius: 10, padding: 12, marginBottom: 12 },
  summaryTitle: { color: '#11181C', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { color: '#6B7280', fontSize: 12 },
  summaryValue: { color: '#374151', fontSize: 12, fontWeight: '600' },
  loader: { marginTop: 10 },
});
