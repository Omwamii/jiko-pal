import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

export default function CircleSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; type?: string }>();

  const circleName = useMemo(() => params.name || 'Kitchen Gas', [params.name]);
  const circleType = useMemo(() => params.type || 'Rental Property', [params.type]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.checkWrap}>
            <View style={styles.checkRing}>
              <MaterialCommunityIcons name="check" size={40} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Circle Created!</Text>
          <Text style={styles.subtitle}>
            Your circle "{circleName}" has been created successfully.
          </Text>

          <AppCard style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons name="account-group" size={22} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryName}>{circleName}</Text>
              <Text style={styles.summaryType}>{circleType}</Text>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>2</Text>
                  <Text style={styles.statLabel}>Members</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>Cylinders</Text>
                </View>
              </View>
            </View>
          </AppCard>

          <AppButton title="Add Cylinder" variant="inverted" style={styles.actionButton} onPress={() => router.push('/add-monitor')} />
          <AppButton title="Go Circle" variant="ghost" style={styles.actionButton} onPress={() => router.replace('/my-circle')} />
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
    marginBottom: 24,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 28,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryType: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  actionButton: {
    width: '100%',
    marginBottom: 12,
  },
});
