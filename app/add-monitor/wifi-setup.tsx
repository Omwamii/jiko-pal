import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Platform, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { connectToSensorNetwork, getTankIdFromSSID, scanSensorNetworks, type SensorWifi } from '@/lib/wifi';

const PRIMARY_COLOR = '#3629B7';

export default function WifiSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();

  const [isScanning, setIsScanning] = useState(true);
  const [networks, setNetworks] = useState<SensorWifi[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<SensorWifi | null>(null);
  const [manualSensorSSID, setManualSensorSSID] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleScan = useCallback(async () => {
    setIsScanning(true);

    try {
      const foundNetworks = await scanSensorNetworks();
      setNetworks(foundNetworks);

      if (foundNetworks.length === 0 && Platform.OS === 'android') {
        Alert.alert('No sensor networks found', 'Turn on your sensor and confirm it is broadcasting LPG-Tank-{TANK_ID}, then refresh.');
      }
    } catch (error) {
      console.error('Failed to scan Wi-Fi networks:', error);
      Alert.alert('Unable to scan Wi-Fi', 'Allow location permission and make sure Wi-Fi is enabled, then try again.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    handleScan();
  }, [handleScan]);

  const handleContinueToCredentials = async () => {
    const fallbackSsid = manualSensorSSID.trim();
    const sensorSSID = selectedNetwork?.ssid || fallbackSsid;

    if (!sensorSSID || !sensorSSID.startsWith('LPG-Tank-')) {
      Alert.alert('Select sensor hotspot', 'Choose or enter a valid sensor SSID that starts with LPG-Tank-.');
      return;
    }

    setIsConnecting(true);

    try {
      await connectToSensorNetwork(sensorSSID);

      router.push({
        pathname: '/add-monitor/wifi-credentials',
        params: {
          fromCircle: params.fromCircle,
          circleId: params.circleId,
          circleName: params.circleName,
          members: params.members,
          tankSSID: sensorSSID,
          tankId: getTankIdFromSSID(sensorSSID),
        },
      } as unknown as Href);
    } catch (error) {
      console.error('Failed to connect to sensor hotspot:', error);
      Alert.alert('Could not connect', 'Ensure you selected the correct sensor hotspot and try again.');
    } finally {
      setIsConnecting(false);
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
              <Text style={styles.headerTitle}>Connect to Sensor Wi-Fi</Text>
              <Text style={styles.headerSubtitle}>Step 2 of 4: Select sensor network</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Pick the sensor network starting with LPG-Tank. The sensor hotspot has no password.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#92400E" />
          <Text style={styles.warningText}>
            Turn off mobile data temporarily while connecting to the sensor hotspot. You can turn it back on after setup.
          </Text>
        </View>

        <View style={styles.networkListHeader}>
          <Text style={styles.sectionTitle}>Sensor Hotspots</Text>
          <TouchableOpacity onPress={handleScan} disabled={isScanning}>
            {isScanning ? (
              <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            ) : (
              <MaterialCommunityIcons name="refresh" size={24} color={PRIMARY_COLOR} />
            )}
          </TouchableOpacity>
        </View>

        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.scanningText}>Scanning for LPG-Tank hotspots...</Text>
          </View>
        ) : (
          <>
            {networks.map((network) => (
              <TouchableOpacity
                key={`${network.ssid}-${network.bssid}`}
                style={[styles.networkCard, selectedNetwork?.ssid === network.ssid && styles.networkCardSelected]}
                onPress={() => setSelectedNetwork(network)}
              >
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name="access-point" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.networkDetails}>
                  <Text style={styles.networkSsid}>{network.ssid}</Text>
                  <Text style={styles.deviceLabel}>Open sensor hotspot</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            ))}

            {(Platform.OS !== 'android' || networks.length === 0) && (
              <View style={styles.manualContainer}>
                <Text style={styles.manualTitle}>Enter sensor SSID manually</Text>
                <TextInput
                  style={styles.input}
                  placeholder="LPG-Tank-XXXX"
                  value={manualSensorSSID}
                  onChangeText={setManualSensorSSID}
                  autoCapitalize="characters"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          style={[styles.primaryButton, isConnecting && styles.primaryButtonDisabled]}
          onPress={handleContinueToCredentials}
          disabled={isConnecting}
        >
          {isConnecting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.primaryButtonText}>Connect and Continue</Text>}
        </TouchableOpacity>
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
    backgroundColor: '#E0E7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    color: '#92400E',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
  },
  networkListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  scanningText: {
    marginTop: 14,
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  networkCardSelected: {
    borderWidth: 1.5,
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#F5F3FF',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECEBFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkDetails: {
    flex: 1,
  },
  networkSsid: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  deviceLabel: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
    fontWeight: '600',
  },
  manualContainer: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  manualTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#111827',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
