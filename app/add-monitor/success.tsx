import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PRIMARY_COLOR = '#3629B7';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="check" size={64} color="#FFF" />
          </View>
          
          <Text style={styles.title}>Monitor Added!</Text>
          <Text style={styles.subtitle}>
            Your gas monitor has been successfully connected and is now tracking your cylinder.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)/index')}
          >
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.replace('/add-monitor')}
          >
            <Text style={styles.secondaryButtonText}>Add Another Monitor</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366F1', // Lighter purple/indigo for the circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#6366F1', // Semi-transparent or lighter button
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
