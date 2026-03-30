import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const CYLINDERS = [
  { id: 'kitchen-gas', name: 'Kitchen Gas', location: 'Home - Kitchen', level: 65, color: '#10B981' },
  { id: 'office-gas', name: 'Office Gas', location: 'Office - Main Floor', level: 85, color: '#10B981' },
  { id: 'backup-cylinder', name: 'Backup Cylinder', location: 'Home - Garage', level: 35, color: '#F59E0B' },
];

export default function RefillSelectScreen() {
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
            <Text style={styles.headerTitle}>Request Refill</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Which cylinder needs refilling?</Text>
        <View style={styles.listWrap}>
          {CYLINDERS.map((cylinder) => (
            <AppCard
              key={cylinder.id}
              style={styles.cylinderCard}
              onPress={() =>
                router.push({
                  pathname: './refill-date',
                  params: {
                    vendorName,
                    cylinderName: cylinder.name,
                    cylinderLevel: String(cylinder.level),
                  },
                })
              }
            >
              <View style={[styles.iconWrap, { backgroundColor: cylinder.color === '#F59E0B' ? '#FEF3C7' : '#D1FAE5' }]}>
                <MaterialCommunityIcons name="fire" size={16} color={cylinder.color} />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{cylinder.name}</Text>
                <Text style={styles.location}>{cylinder.location}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${cylinder.level}%`, backgroundColor: cylinder.color }]} />
                  </View>
                  <Text style={styles.levelText}>{cylinder.level}%</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </AppCard>
          ))}
        </View>
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
  listWrap: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 2,
    padding: 6,
  },
  cylinderCard: {
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  info: { flex: 1 },
  name: { color: '#11181C', fontSize: 14, fontWeight: '700' },
  location: { color: '#9CA3AF', fontSize: 9, marginTop: 1 },
  progressRow: { marginTop: 5, flexDirection: 'row', alignItems: 'center' },
  track: { width: 95, height: 4, borderRadius: 2, backgroundColor: '#E5E7EB', marginRight: 8 },
  fill: { height: 4, borderRadius: 2 },
  levelText: { color: '#6B7280', fontSize: 9, fontWeight: '700' },
});
