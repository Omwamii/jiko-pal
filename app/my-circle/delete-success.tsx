import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';

const PRIMARY_COLOR = '#3629B7';

export default function CircleDeleteSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string }>();

  const circleName = useMemo(() => params.name || 'Circle', [params.name]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.checkWrap}>
            <View style={styles.checkRing}>
              <MaterialCommunityIcons name="delete" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Circle Deleted</Text>
          <Text style={styles.subtitle}>
            The circle "{circleName}" has been deleted successfully.
          </Text>

          <AppButton 
            title="View All Circles" 
            variant="inverted" 
            style={styles.actionButton} 
            onPress={() => router.replace('/my-circle')} 
          />
          <AppButton 
            title="Go to Dashboard" 
            variant="ghost" 
            style={styles.actionButton} 
            onPress={() => router.replace('/')} 
          />
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  checkWrap: {
    marginBottom: 20,
  },
  checkRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    textAlign: 'center',
    marginBottom: 40,
  },
  actionButton: {
    width: '100%',
    marginBottom: 12,
  },
});