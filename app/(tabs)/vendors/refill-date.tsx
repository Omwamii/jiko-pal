import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { AppButton } from '@/components/ui/AppButton';
import { useCreateRefillRequest } from '@/hooks/queries';
import { useAuth } from '@/providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

// Get current date info
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDate = now.getDate();

// Generate days for a given month/year
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

export default function RefillDateScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    vendorId?: string; 
    vendorName?: string; 
    cylinderName?: string; 
    cylinderLevel?: string;
    catalogueId?: string;
    deviceId?: string;
  }>();
  
  const vendorName = useMemo(() => params.vendorName || 'Quick Gas', [params.vendorName]);
  const cylinderName = useMemo(() => params.cylinderName || 'Kitchen Gas', [params.cylinderName]);
  const vendorId = params.vendorId;
  const catalogueId = params.catalogueId;
  const deviceId = params.deviceId || '';
  
  const [selectedDay, setSelectedDay] = useState(currentDate);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const createRequestMutation = useCreateRefillRequest();
  const { clientProfile } = useAuth();

  // Calculate days for current selected month/year
  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
  const days = useMemo(() => {
    const result = [];
    // Add empty cells for days before the first day of month
    for (let i =0; i < firstDay; i++) {
      result.push(null);
    }
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(i);
    }
    return result;
  }, [daysInMonth, firstDay]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDay(1); // Reset selected day when changing month
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDay(1); // Reset selected day when changing month
  };

  const isDaySelectable = (day: number) => {
    // Can't select dates in the past
    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return day >= currentDate;
    }
    // Can select any day in future months
    if (selectedYear > currentYear || (selectedYear === currentYear && selectedMonth > currentMonth)) {
      return true;
    }
    return false;
  };

  const handleConfirmOrder = async () => {
    if (!vendorId) {
      Alert.alert('Error', 'Missing vendor information');
      return;
    }

    try {
      const scheduledDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      const requestData: any = {
        provider_id: vendorId,
        scheduled_date: scheduledDate,
        notes: `Refill for ${cylinderName}`,
        client_id: clientProfile?.id,
      };

      if (catalogueId) {
        requestData.catalogue_item_id = catalogueId;
      }

      if (deviceId) {
        requestData.device_id = deviceId;
      }
      
      await createRequestMutation.mutateAsync(requestData);

      router.replace({
        pathname: '/(tabs)/vendors/refill-success',
        params: { vendorId, vendorName, cylinderName },
      } as Href);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to create refill request');
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
            <TouchableOpacity onPress={handlePrevMonth} style={styles.chevronBtn}>
              <MaterialCommunityIcons name="chevron-left" size={20} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{MONTHS[selectedMonth]} {selectedYear}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.chevronBtn}>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#374151" />
            </TouchableOpacity>
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
              if (day === null) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }
              const selectable = isDaySelectable(day);
              const selected = day === selectedDay;
              return (
                <TouchableOpacity 
                  key={`${day}-${index}`} 
                  style={styles.dayCell} 
                  onPress={() => selectable && setSelectedDay(day)}
                  disabled={!selectable}
                >
                  <View style={[styles.dayCircle, selected && styles.dayCircleSelected, !selectable && styles.dayCircleDisabled]}>
                    <Text style={[styles.dayNum, selected && styles.dayNumSelected, !selectable && styles.dayNumDisabled]}>{day}</Text>
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
          {catalogueId && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Catalogue Item:</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>Yes</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vendor:</Text>
            <Text style={styles.summaryValue}>{vendorName}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={[styles.summaryValue, { color: PRIMARY_COLOR }]}>{selectedDay} {MONTHS[selectedMonth]}</Text>
          </View>
        </AppCard>

        <AppButton
          title={createRequestMutation.isPending ? 'Confirming...' : 'Confirm Order'}
          onPress={handleConfirmOrder}
          disabled={createRequestMutation.isPending}
        />
        {createRequestMutation.isPending && (
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
  monthText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  chevronBtn: { padding: 8 },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 4 },
  dayLabel: { color: '#6B7280', fontSize: 11, width: 28, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.2857%', alignItems: 'center', marginVertical: 2 },
  dayCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  dayCircleSelected: { backgroundColor: PRIMARY_COLOR },
  dayCircleDisabled: { opacity: 0.3 },
  dayNum: { color: '#374151', fontSize: 12 },
  dayNumSelected: { color: '#FFFFFF', fontWeight: '700' },
  dayNumDisabled: { color: '#D1D5DB' },
  summaryCard: { borderRadius: 10, padding: 12, marginBottom: 12 },
  summaryTitle: { color: '#11181C', fontWeight: '700', fontSize: 14, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { color: '#6B7280', fontSize: 12 },
  summaryValue: { color: '#374151', fontSize: 12, fontWeight: '600' },
  loader: { marginTop: 10 },
});
