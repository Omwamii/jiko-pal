import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { stopForcingWifiUsage } from '@/lib/wifi';

const PRIMARY_COLOR = '#3629B7';

export default function WifiCredentialsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    fromCircle?: string;
    circleId?: string;
    circleName?: string;
    members?: string;
    tankId?: string;
    tankSSID?: string;
  }>();

  const [homeSSID, setHomeSSID] = useState('');
  const [homePassword, setHomePassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      stopForcingWifiUsage().catch(() => {
        // no-op cleanup
      });
    };
  }, []);

  const sendCredentialsToTank = async (ssid: string, pass: string) => {
    const response = await fetch('http://192.168.4.1/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ssid,
        pass,
      }),
    });

    const json = await response.json().catch(() => ({}));
    return { response, json };
  };

  const handleSendCredentials = async () => {
    if (!homeSSID.trim() || !homePassword.trim()) {
      Alert.alert('Missing details', 'Enter your home Wi-Fi or hotspot name and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { response, json } = await sendCredentialsToTank(homeSSID.trim(), homePassword);

      if (!response.ok) {
        Alert.alert(
          'Sensor rejected credentials',
          typeof json?.detail === 'string'
            ? json.detail
            : 'Please confirm your Wi-Fi details and try again.'
        );
        return;
      }

      await stopForcingWifiUsage();

      router.push({
        pathname: '/add-monitor/details',
        params: {
          fromCircle: params.fromCircle,
          circleId: params.circleId,
          circleName: params.circleName,
          members: params.members,
          provisioned: '1',
          tankId: params.tankId,
          tankSSID: params.tankSSID,
        },
      } as Href);
    } catch (error) {
      console.error('Network error while sending credentials:', error);
      Alert.alert('Network error', 'Unable to reach the sensor. Confirm you are connected to its Wi-Fi and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Home Wi-Fi Details</Text>
              <Text style={styles.headerSubtitle}>Step 3 of 4: Send credentials to sensor</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.connectedBox}>
          <MaterialCommunityIcons name="access-point-check" size={20} color="#10B981" />
          <View style={styles.connectedBoxTextWrap}>
            <Text style={styles.connectedTitle}>Connected to sensor</Text>
            <Text style={styles.connectedSubtitle}>{params.tankSSID || 'LPG-Tank'}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Enter the Wi-Fi name and password that the sensor should use after reboot.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Home Wi-Fi / Hotspot name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Omwami_5G"
            value={homeSSID}
            onChangeText={setHomeSSID}
            autoCapitalize="none"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter network password"
            value={homePassword}
            onChangeText={setHomePassword}
            secureTextEntry
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
          disabled={isSubmitting}
          onPress={handleSendCredentials}
        >
          {isSubmitting ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.primaryButtonText}>Send Credentials</Text>}
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
    padding: 20,
    paddingBottom: 40,
  },
  connectedBox: {
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  connectedBoxTextWrap: {
    marginLeft: 8,
  },
  connectedTitle: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '700',
  },
  connectedSubtitle: {
    color: '#166534',
    fontSize: 12,
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: '#E0E7FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
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
    marginTop: 10,
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
