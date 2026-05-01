import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { useDisconnectDevice } from '@/hooks/queries';

const PRIMARY_COLOR = '#3629B7';

const size = 160;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function CircleCylinderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; location?: string; fill?: string; deviceId?: string }>();
  const [disconnecting, setDisconnecting] = useState(false);

  const { mutate: disconnect } = useDisconnectDevice();

  const cylinderName = useMemo(() => params.name || 'Kitchen Gas', [params.name]);
  const status = useMemo(() => Number(params.fill || '65'), [params.fill]);
  const location = useMemo(() => params.location || 'Home - Kitchen', [params.location]);
  const strokeDashoffset = circumference - (circumference * status) / 100;

  const handleDisconnect = () => {
    if (!params.deviceId) return;
    Alert.alert(
      'Disconnect Sensor',
      `Disconnect ${cylinderName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: () => {
            setDisconnecting(true);
            disconnect(params.deviceId!, {
              onSettled: () => setDisconnecting(false),
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{cylinderName}</Text>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.body}>
        <AppCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.label}>Main Cylinder</Text>
              <Text style={styles.name}>{cylinderName}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Good</Text>
            </View>
          </View>

          <Text style={styles.location}>{location}</Text>

          <View style={styles.progressContainer}>
            <Svg width={size} height={size}>
              <Circle
                stroke="#E5E7EB"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke="#10B981"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={`${strokeDashoffset}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>

            <View style={styles.progressCenter}>
              <MaterialCommunityIcons name="fire" size={30} color="#F59E0B" />
              <Text style={styles.percentText}>{status}%</Text>
              <Text style={styles.remainingText}>Remaining</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Used Today</Text>
              <Text style={styles.metricValue}>2.3 kg</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Est. Days Left</Text>
              <Text style={styles.metricValue}>12 days</Text>
            </View>
          </View>

          <AppButton title="Request Refill" onPress={() => {
            router.push({
              pathname: '/(tabs)/vendors',
              params: {
                preselectedCylinderName: cylinderName,
                preselectedCylinderLevel: String(status),
              },
            } as Href);
          }} style={styles.refillButton} />

          {params.deviceId && (
            <TouchableOpacity
              style={[styles.disconnectBtn, disconnecting && styles.btnDisabled]}
              onPress={handleDisconnect}
              disabled={disconnecting}
            >
              <Text style={styles.disconnectText}>
                {disconnecting ? 'Disconnecting...' : 'Disconnect Sensor'}
              </Text>
            </TouchableOpacity>
          )}
        </AppCard>
      </View>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  body: {
    padding: 18,
  },
  card: {
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 10,
  },
  name: {
    color: '#11181C',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  location: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 11,
  },
  progressContainer: {
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#11181C',
    lineHeight: 38,
  },
  remainingText: {
    fontSize: 11,
    color: '#6B7280',
  },
  metricsRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#11181C',
    marginTop: 2,
  },
  refillButton: {
    marginTop: 14,
    height: 40,
  },
  disconnectBtn: {
    marginTop: 10,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  disconnectText: { color: '#DC2626', fontSize: 14, fontWeight: '600' },
});
