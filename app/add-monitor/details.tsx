import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function DeviceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fromCircle?: string; circleId?: string; circleName?: string; members?: string }>();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [cylinderSize, setCylinderSize] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddMonitor = () => {
    if (!name || !location) {
      Alert.alert('Required Fields', 'Please fill in the monitor name and location.');
      return;
    }

    // In a real app, this would send data to the backend
    router.replace({
      pathname: '/add-monitor/success',
      params: {
        fromCircle: params.fromCircle,
        circleId: params.circleId,
        circleName: params.circleName,
        members: params.members,
      },
    } as Href);
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
              <Text style={styles.headerTitle}>Scan Device</Text>
              <Text style={styles.headerSubtitle}>Step 3 of 3: Name your Monitor</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Monitor Name *</Text>
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
            <Text style={styles.deviceInfoLabel}>Model:</Text>
            <Text style={styles.deviceInfoValue}>GasMonitor Pro</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Serial:</Text>
            <Text style={styles.deviceInfoValue}>GM-2026-A1BC3</Text>
          </View>
          <View style={styles.deviceInfoRow}>
            <Text style={styles.deviceInfoLabel}>Firmware:</Text>
            <Text style={styles.deviceInfoValue}>v2.1.4</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddMonitor}>
          <Text style={styles.primaryButtonText}>Add Monitor</Text>
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
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
