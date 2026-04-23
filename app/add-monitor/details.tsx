import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/providers/AuthProvider';
import { clientService } from '@/lib/client';
import { deviceService } from '@/lib/device';

const PRIMARY_COLOR = '#3629B7';

export default function DeviceDetailsScreen() {
  const router = useRouter();
  const { clientProfile } = useAuth();
  const params = useLocalSearchParams<{
    fromCircle?: string;
    circleId?: string;
    circleName?: string;
    members?: string;
    provisioned?: string;
    tankId?: string;
    tankSSID?: string;
  }>();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cylinderSize, setCylinderSize] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isProvisioned = params.provisioned === '1';

  const buildDeviceId = () => {
    if (params.tankId?.trim()) {
      const trimmedTankId = params.tankId.trim();
      return trimmedTankId.startsWith('LPG-Tank-') ? trimmedTankId.split('-')[2] : trimmedTankId;
    }
    throw new Error('Tank ID is undefined.')
  };

  const handleAddMonitor = async () => {
    if (!name || !location) {
      Alert.alert('Required Fields', 'Please fill in the monitor name and location.');
      return;
    }

    setIsSubmitting(true);

    try {
      const clientId = clientProfile?.id || (await clientService.getMyClient()).id;
      const deviceId = buildDeviceId();
      
      await deviceService.updateDevice(deviceId, {
        owner_id: clientId,
      });

      router.replace({
        pathname: '/add-monitor/success',
        params: {
          fromCircle: params.fromCircle,
          circleId: params.circleId,
          circleName: params.circleName,
          members: params.members,
        },
      } as Href);
    } catch (error) {
      console.error('Failed to attach monitor:', error);
      Alert.alert('Could not add cylinder', 'The sensor was configured, but attaching to your account failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
              <Text style={styles.headerTitle}>Cylinder Details</Text>
              <Text style={styles.headerSubtitle}>Step 4 of 4: Attach to account</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isProvisioned && (
          <View style={styles.provisionedBox}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color="#10B981" />
            <View style={styles.provisionedTextWrap}>
              <Text style={styles.provisionedTitle}>Sensor Wi-Fi setup complete</Text>
              <Text style={styles.provisionedText}>
                Connected hotspot: {params.tankSSID || 'LPG-TANK'}
              </Text>
            </View>
          </View>
        )}
        
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cylinder Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kitchen Gas, Office Gas"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Location Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Home - kitchen, office"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Cylinder Size Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cylinder Size</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 6kg, 13kg"
            value={cylinderSize}
            onChangeText={setCylinderSize}
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        {/* Notes Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="e.g. 123 Main Street, Apt 4B, Nairobi, NB 10001"
            value={notes}
            onChangeText={setNotes}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Device Information Block */}
        <View style={styles.deviceInfoContainer}>
          <Text style={styles.deviceInfoTitle}>Device Information</Text>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Sensor:</Text>
            <Text style={styles.deviceInfoValue}>{params.tankSSID || 'Unspecified sensor'}</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Tank ID:</Text>
            <Text style={styles.deviceInfoValue}>{params.tankId || 'Will auto-generate'}</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Status:</Text>
            <Text style={styles.deviceInfoValue}>{isProvisioned ? 'Provisioned over Wi-Fi' : 'Manual attach'}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]} onPress={handleAddMonitor} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.primaryButtonText}>Add Cylinder</Text>}
        </TouchableOpacity>

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
    padding: 24,
    paddingBottom: 40,
  },
  provisionedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  provisionedTextWrap: {
    marginLeft: 8,
    flex: 1,
  },
  provisionedTitle: {
    fontSize: 13,
    color: '#065F46',
    fontWeight: '700',
  },
  provisionedText: {
    fontSize: 12,
    color: '#065F46',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  deviceInfoContainer: {
    backgroundColor: '#E2E1F1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    marginTop: 8,
  },
  deviceInfoTitle: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  deviceInfoRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  deviceInfoLabel: {
    width: 65,
    fontSize: 12,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  deviceInfoValue: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
  },
  primaryButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
