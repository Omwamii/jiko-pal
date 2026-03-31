import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

const MOCK_NETWORKS = [
  { id: '1', ssid: 'Omwami_5G', signal: 'excellent' },
  { id: '2', ssid: 'Nairobi_Guest_WiFi', signal: 'good' },
  { id: '3', ssid: 'JikoPal_Sensor_A1B2', signal: 'excellent', isDevice: true },
  { id: '4', ssid: 'HUAWEI-E5573-8AF2', signal: 'fair' }
];

export default function WifiSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();
  const [isScanning, setIsScanning] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<typeof MOCK_NETWORKS[0] | null>(null);
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Simulate initial scan down for available networks
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      router.push({
        pathname: '/add-monitor/details',
        params: {
          fromCircle: params.fromCircle,
          circleId: params.circleId,
          circleName: params.circleName,
          members: params.members,
        },
      } as Href);
    }, 1500);
  };

  const renderSignalIcon = (signal: string) => {
    switch (signal) {
      case 'excellent': return 'wifi-strength-4';
      case 'good': return 'wifi-strength-3';
      case 'fair': return 'wifi-strength-2';
      default: return 'wifi-strength-1';
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>WiFi Provisioning</Text>
              <Text style={styles.headerSubtitle}>Step 2 of 3: Connect to sensor</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Connect your sensor to your local Wi-Fi network so it can send data to your phone automatically.
          </Text>
        </View>

        {isScanning ? (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.scanningText}>Scanning for nearby networks...</Text>
          </View>
        ) : (
          <>
            <View style={styles.networkListHeader}>
              <Text style={styles.sectionTitle}>Available Networks</Text>
              <TouchableOpacity onPress={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 1500); }}>
                <MaterialCommunityIcons name="refresh" size={24} color={PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>

            {MOCK_NETWORKS.map((network) => (
              <View key={network.id} style={styles.networkCardWrapper}>
                <TouchableOpacity
                  style={[
                    styles.networkCard,
                    selectedNetwork?.id === network.id && styles.networkCardSelected
                  ]}
                  onPress={() => setSelectedNetwork(selectedNetwork?.id === network.id ? null : network)}
                >
                  <View style={[styles.iconBadge, network.isDevice && { backgroundColor: '#D1FAE5' }]}>
                    <MaterialCommunityIcons 
                      name={network.isDevice ? "cube-scan" : "wifi"} 
                      size={20} 
                      color={network.isDevice ? "#10B981" : "#6B7280"} 
                    />
                  </View>
                  <View style={styles.networkDetails}>
                    <Text style={[styles.networkSsid, selectedNetwork?.id === network.id && { color: PRIMARY_COLOR }]}>
                      {network.ssid}
                    </Text>
                    {network.isDevice && <Text style={styles.deviceLabel}>JikoPal Device Hotspot</Text>}
                  </View>
                  <MaterialCommunityIcons name={renderSignalIcon(network.signal)} size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {/* Password Input Expanding Area */}
                {selectedNetwork?.id === network.id && (
                  <View style={styles.passwordContainer}>
                    <Text style={styles.inputLabel}>Enter Password for {network.ssid}</Text>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Wi-Fi Password"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity 
                      style={[styles.connectButton, (!password && !network.isDevice) && styles.connectButtonDisabled]}
                      disabled={!password && !network.isDevice}
                      onPress={handleConnect}
                    >
                      {isConnecting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.connectButtonText}>Connect to Network</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Scan Fallback */}
        {!isScanning && (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>Don't want to use Wi-Fi matching?</Text>
            <TouchableOpacity
              style={styles.fallbackButton}
              onPress={() =>
                router.push({
                  pathname: '/add-monitor/scan',
                  params: {
                    fromCircle: params.fromCircle,
                    circleId: params.circleId,
                    circleName: params.circleName,
                    members: params.members,
                  },
                } as Href)
              }
            >
              <MaterialCommunityIcons name="qrcode-scan" size={20} color={PRIMARY_COLOR} />
              <Text style={styles.fallbackButtonText}>Scan QR Code instead</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 24,
  },
  infoText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    lineHeight: 20,
  },
  scanningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  scanningText: {
    marginTop: 16,
    color: '#4B5563',
    fontSize: 14,
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
  networkCardWrapper: {
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  networkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  networkCardSelected: {
    backgroundColor: '#F5F3FF',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  networkDetails: {
    flex: 1,
  },
  networkSsid: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  deviceLabel: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 2,
    fontWeight: '600',
  },
  passwordContainer: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#F5F3FF',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  passwordInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  connectButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fallbackContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fallbackText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  fallbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECEBFA',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  fallbackButtonText: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
});
