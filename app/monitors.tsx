import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { MonitorReadingSummary } from '@/components/MonitorReadingSummary';
import { RawLevelReading } from '@/components/RawLevelReading';
import { useDevices, useDisconnectDevice } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

export default function MonitorsScreen() {
  const router = useRouter();
  const { data: devicesData, isLoading } = useDevices();
  const [searchQuery, setSearchQuery] = useState('');
  const { mutate: disconnectDevice, isPending: disconnecting } = useDisconnectDevice();

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
            <Text style={styles.headerTitle}>Connected Gas Level Sensors</Text>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by sensor name...." 
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Active Level Sensors</Text>

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
                <Text style={styles.addButtonText}>Add Gas Level Sensor</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredDevices.map((device) => {
            const statusColors = getStatusColor(device.current_level);
            return (
              <AppCard
                key={device.id}
                style={styles.listCard}
                onPress={() =>
                  router.push({
                    pathname: '/my-circle/cylinder',
                    params: {
                      name: device.device_id,
                      location: device.owner_name || device.mac_address || 'Unknown',
                      fill: String(device.current_level),
                      deviceId: device.device_id,
                      deviceUuid: device.id,
                    },
                  } as Href)
                }
              >
                <View style={[styles.itemIcon, { backgroundColor: statusColors.bg }]}>
                  <MaterialCommunityIcons name="fire" size={18} color={statusColors.color} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{device.device_id}</Text>
                  <Text style={styles.itemSubtitle}>{device.owner_name || 'Unassigned'}</Text>
                  <View style={styles.progressRow}>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${device.current_level}%`,
                            backgroundColor: device.current_level < 20 ? '#EF4444' : device.current_level < 50 ? '#F59E0B' : '#10B981',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{device.current_level}%</Text>
                  </View>
                  <RawLevelReading deviceId={device.device_id} style={styles.readingText} missingText="N/A" />
                  <MonitorReadingSummary deviceId={device.device_id} compact />
                </View>
                <View style={styles.deviceActions}>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Disconnect Sensor', `Disconnect ${device.device_id}?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Disconnect', style: 'destructive', onPress: () => disconnectDevice(device.id) },
                      ]);
                    }}
                    disabled={disconnecting}
                    style={styles.removeBtn}
                  >
                    <MaterialCommunityIcons name="link-off" size={18} color="#EF4444" />
                  </TouchableOpacity>
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                </View>
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
  listCard: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  itemContent: {
    flex: 1,
  },
  deviceActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  readingText: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressTrack: {
    width: 90,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
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
