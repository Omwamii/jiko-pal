import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';

const PRIMARY_COLOR = '#3629B7';

export default function RefillSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vendorName?: string; cylinderName?: string }>();
  const vendorName = useMemo(() => params.vendorName || 'QuickGas Ltd', [params.vendorName]);
  const cylinderName = useMemo(() => params.cylinderName || 'Office Gas', [params.cylinderName]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.checkRing}>
            <MaterialCommunityIcons name="check" size={50} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.subtitle}>Your refill request has been sent to {vendorName}</Text>

          <AppCard style={styles.summaryCard}>
            <View style={styles.itemRow}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="fire" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.itemLabel}>Cylinder</Text>
                <Text style={styles.itemValue}>{cylinderName}</Text>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="account-group" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.itemLabel}>Vendor</Text>
                <Text style={styles.itemValue}>{vendorName.replace(' Ltd', '')}</Text>
              </View>
            </View>

            <View style={styles.itemRow}>
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons name="cash" size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.itemLabel}>Amount</Text>
                <Text style={styles.itemValue}>Ksh. 1500</Text>
              </View>
            </View>
          </AppCard>

          <AppButton
            title="Chat with vendor"
            onPress={() => router.replace({ pathname: './chat', params: { vendorName } })}
            variant="inverted"
            style={styles.chatBtn}
            textStyle={styles.chatText}
          />
          <AppButton title="Go to Dashboard" onPress={() => router.replace('/(tabs)')} variant="ghost" style={styles.dashboardBtn} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARY_COLOR },
  safe: { flex: 1 },
  content: { flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' },
  checkRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 14 },
  subtitle: { color: '#D1D5DB', fontSize: 11, marginTop: 4, marginBottom: 16 },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    shadowOpacity: 0,
    elevation: 0,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  itemLabel: { color: '#D1D5DB', fontSize: 10 },
  itemValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  chatBtn: { width: '100%', marginBottom: 10, backgroundColor: '#FFFFFF' },
  chatText: { color: '#4B5563' },
  dashboardBtn: { width: '100%' },
});
