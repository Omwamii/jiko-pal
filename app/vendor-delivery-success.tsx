import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { type Href, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VendorDeliverySuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.iconWrap}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="check-circle-outline" size={78} color="#FFFFFF" />
        </View>
      </View>

      <Text style={styles.title}>Delivery Completed!</Text>
      <Text style={styles.subtitle}>
        The customer has been notified and will be prompted to leave a review.
      </Text>

      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => router.replace('/vendor-dashboard' as Href)}>
        <Text style={styles.primaryText}>Go to Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={() => router.push('/vendor-reviews' as Href)}>
        <Text style={styles.secondaryText}>Continue to Customer Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3629B7',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 18, color: '#FFFFFF', fontSize: 34, fontWeight: '700' },
  subtitle: {
    marginTop: 10,
    color: '#D8D8F4',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 270,
  },
  primaryButton: {
    width: '100%',
    marginTop: 26,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#3629B7', fontSize: 12, fontWeight: '600' },
  secondaryButton: {
    width: '100%',
    marginTop: 12,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#ECECFB', fontSize: 12, fontWeight: '500' },
});
