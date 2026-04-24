import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppCard } from '@/components/ui/AppCard';
import { useDevices } from '@/hooks/queries';
import { deviceService } from '@/lib/device';
import { IoTDevice } from '@/types';

const PRIMARY_COLOR = '#3629B7';

export default function AddExistingCylinderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();
  const { data: devicesData, isLoading } = useDevices();

  const [updatingDeviceId, setUpdatingDeviceId] = useState<string | null>(null);

  const nextParams = {
    fromCircle: params.fromCircle,
    circleId: params.circleId,
    circleName: params.circleName,
    members: params.members,
  };

  const eligibleDevices = useMemo(() => {
    const devices = devicesData?.results || [];
    return devices.filter((d) => !d.circle && !d.circle_name);
  }, [devicesData]);

  const attachToCircle = async (device: IoTDevice) => {
    const circleId = params.circleId;
    if (!circleId) {
      Alert.alert('Missing circle', 'No circle was selected. Please go back and try again.');
      return;
    }

    setUpdatingDeviceId(device.device_id);
    try {
      await deviceService.updateDevice(device.device_id, { circle_id: circleId });
      router.replace({ pathname: '/add-monitor/success', params: nextParams } as Href);
    } catch (err) {
      console.error('Failed to attach cylinder to circle:', err);
      Alert.alert('Error', 'Failed to add cylinder to circle. Please try again.');
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Add Existing Cylinder</Text>
              <Text style={styles.headerSubtitle}>Select a connected cylinder</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={20} color={PRIMARY_COLOR} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Personal cylinders</Text>
            <Text style={styles.infoText}>Choose a cylinder already connected to your account, then add it to this circle.</Text>
          </View>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={styles.loader} />
        ) : eligibleDevices.length === 0 ? (
          <Text style={styles.emptyText}>No individually connected cylinders available.</Text>
        ) : (
          eligibleDevices.map((device) => {
            const isUpdating = updatingDeviceId === device.device_id;
            return (
              <AppCard
                key={device.device_id}
                style={styles.listCard}
                onPress={() => (updatingDeviceId ? null : attachToCircle(device))}
              >
                <View style={[styles.itemIcon, { backgroundColor: '#EEF2FF' }]}>
                  <MaterialCommunityIcons name="gas-cylinder" size={18} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{device.device_id}</Text>
                  <Text style={styles.itemSubtitle}>{device.owner_name || 'My cylinder'}</Text>
                </View>
                {isUpdating ? (
                  <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                ) : (
                  <MaterialCommunityIcons name="chevron-right" size={22} color="#9CA3AF" />
                )}
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
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#ECEBFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  infoText: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 18,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 20,
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
});

