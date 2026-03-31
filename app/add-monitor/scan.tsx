import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function ScanDeviceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'found'>('idle');

  const handleStartScan = () => {
    setScanState('scanning');
    // Simulate a scan delay
    setTimeout(() => {
      setScanState('found');
    }, 2500);
  };

  const handleDeviceSelect = () => {
    router.push({
      pathname: '/add-monitor/details',
      params: {
        fromCircle: params.fromCircle,
        circleId: params.circleId,
        circleName: params.circleName,
        members: params.members,
      },
    } as Href);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Scan Device</Text>
              <Text style={styles.headerSubtitle}>Step 2 of 3: Connect to sensor</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Info Box Details (Visible only when idle or scanning) */}
        {scanState !== 'found' ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Before you start:</Text>
            <View style={styles.infoListItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={PRIMARY_COLOR} />
              <Text style={styles.infoListText}>Make sure your IoT sensor is powered on</Text>
            </View>
            <View style={styles.infoListItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={PRIMARY_COLOR} />
              <Text style={styles.infoListText}>Enable Bluetooth on your phone</Text>
            </View>
            <View style={styles.infoListItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={PRIMARY_COLOR} />
              <Text style={styles.infoListText}>Keep your phone within 2 meters of the sensor</Text>
            </View>
          </View>
        ) : (
          <View style={styles.successBox}>
            <MaterialCommunityIcons name="check-circle-outline" size={24} color="#10B981" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.successTitle}>Device Found!</Text>
              <Text style={styles.successSubtitle}>1 sensor detected nearby</Text>
            </View>
          </View>
        )}

        {/* Center Scanner Area */}
        {scanState !== 'found' && (
          <View style={styles.scannerContainer}>
            <View style={styles.scannerCircle}>
              {scanState === 'idle' ? (
                <MaterialCommunityIcons name="qrcode-scan" size={80} color={PRIMARY_COLOR} />
              ) : (
                <ActivityIndicator size={60} color={PRIMARY_COLOR} />
              )}
            </View>
            
            <Text style={styles.statusTitle}>
              {scanState === 'idle' ? 'Ready to Scan' : 'Scanning'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {scanState === 'idle' 
                ? 'Tap the button below to start scanning for nearby gas monitoring devices' 
                : 'Looking for nearby devices...'}
            </Text>
          </View>
        )}

        {/* Found Device Area */}
        {scanState === 'found' && (
          <View style={styles.deviceFoundContainer}>
            <Text style={styles.sectionTitle}>Available devices</Text>
            
            <TouchableOpacity style={styles.deviceCard} onPress={handleDeviceSelect}>
              <View style={[styles.deviceIcon, { backgroundColor: PRIMARY_COLOR }]}>
                <MaterialCommunityIcons name="qrcode-scan" size={24} color="#FFF" />
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>GasMonitor Pro</Text>
                <Text style={styles.deviceSerial}>Serial: GM-2026-A1BC3</Text>
                <Text style={styles.deviceSignal}>Connected via WiFi / BLE</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.scanAgainButton}
              onPress={() => setScanState('idle')}
            >
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Bottom Button for Idle state */}
      {scanState === 'idle' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartScan}>
            <Text style={styles.primaryButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      )}

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
    padding: 24,
    paddingBottom: 40,
  },
  infoBox: {
    backgroundColor: '#ECEBFA',
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
  },
  infoTitle: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
  },
  infoListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoListText: {
    color: '#4B5563',
    fontSize: 12,
    marginLeft: 8,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  successTitle: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 15,
  },
  successSubtitle: {
    color: '#10B981',
    fontSize: 12,
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  scannerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  deviceFoundContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  deviceSerial: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  deviceSignal: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  scanAgainButton: {
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  scanAgainText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
