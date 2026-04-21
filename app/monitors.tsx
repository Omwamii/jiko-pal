import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useDevices } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function MonitorsScreen() {
  const router = useRouter();
  const { data: devicesData, isLoading } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');

  const devices = devicesData?.results || [];
  
  const filteredDevices = devices.filter(device => 
    device.device_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (level: number) => {
    if (level >= 50) return { bg: '#D1FAE5', color: '#10B981' };
    if (level >= 20) return { bg: '#FEF3C7', color: '#F59E0B' };
    return { bg: '#FEE2E2', color: '#EF4444' };
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      </View>
    );
  }

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
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by monitor name...." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Active Monitors</Text>

        {filteredDevices.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="gas-cylinder" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No monitors found' : 'No monitors yet. Add one to get started!'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/add-monitor')}
              >
                <Text style={styles.addButtonText}>Add Monitor</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredDevices.map((device) => {
            const statusColors = getStatusColor(device.current_level);
            return (
              <AppCard
                key={device.id}
                style={styles.monitorCard}
                onPress={() =>
                  router.push({
                    pathname: '/my-circle/cylinder',
                    params: {
                      name: device.device_id,
                      location: device.mac_address || 'Unknown location',
                      fill: String(device.current_level),
                    },
                  } as Href)
                }
              >
                <View style={[styles.iconBadge, { backgroundColor: statusColors.bg }]}> 
                  <MaterialCommunityIcons name="fire" size={18} color={statusColors.color} />
                </View>
                <View style={styles.cardDetails}>
                  <Text style={styles.monitorTitle}>{device.device_id}</Text>
                  <Text style={styles.monitorSubtitle}>
                    {device.current_level}% remaining • {device.status}
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
              </AppCard>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
