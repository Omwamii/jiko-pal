import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

const monitors = [
  { id: 'office-gas', name: 'Office Gas', subtitle: 'Created by you', location: 'Office - Main Floor', fill: 85, icon: 'water', iconBg: '#D1FAE5', iconColor: '#10B981' },
  { id: 'backup-cylinder', name: 'Backup Cylinder', subtitle: 'Monitored via Family Home', location: 'Home - Garage', fill: 35, icon: 'fire', iconBg: '#FEF3C7', iconColor: '#F59E0B' },
  { id: 'kitchen-gas', name: 'Kitchen Gas', subtitle: 'Created by you', location: 'Home - Kitchen', fill: 65, icon: 'water', iconBg: '#D1FAE5', iconColor: '#10B981' },
];

export default function MonitorsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Monitors</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="Search by monitor name...." placeholderTextColor="#9CA3AF" />
        </View>

        <Text style={styles.sectionTitle}>Active Monitors</Text>

        {monitors.map((monitor) => (
          <AppCard
            key={monitor.id}
            style={styles.monitorCard}
            onPress={() =>
              router.push({
                pathname: '/my-circle/cylinder',
                params: {
                  name: monitor.name,
                  location: monitor.location,
                  fill: String(monitor.fill),
                },
              } as Href)
            }
          >
            <View style={[styles.iconBadge, { backgroundColor: monitor.iconBg }]}> 
              <MaterialCommunityIcons name={monitor.icon as any} size={18} color={monitor.iconColor} />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.monitorTitle}>{monitor.name}</Text>
              <Text style={styles.monitorSubtitle}>{monitor.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
          </AppCard>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollContent: {
    padding: 24,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  monitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  monitorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  monitorSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
