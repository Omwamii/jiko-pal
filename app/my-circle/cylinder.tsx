import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Svg, { Circle } from 'react-native-svg';
import { AppButton } from '@/components/ui/AppButton';
import { AppCard } from '@/components/ui/AppCard';
import { useChangeActivityMode, useDevice, useDisconnectDevice, useLatestDeviceReading, useUpdateDevice } from '@/hooks/queries';
import { useAuth } from '@/providers/AuthProvider';
import { getSignalQuality, getSignalQualityColors, getSignalQualityLabel } from '@/lib/signalStrength';

const PRIMARY_COLOR = '#3629B7';

const size = 160;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

const parseCylinderSizeKg = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/(\d+(\.\d+)?)/);
  if (!match) return NaN;
  return Number(match[1]);
};

export default function CircleCylinderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; location?: string; fill?: string; deviceId?: string }>();
  const [disconnecting, setDisconnecting] = useState(false);
  const [cylinderSizeDraft, setCylinderSizeDraft] = useState('');

  const { mutate: disconnect } = useDisconnectDevice();
  const { clientProfile } = useAuth();
  const { mutate: updateDevice, isPending: updatingDevice } = useUpdateDevice();
  const { mutate: changeActivityMode, isPending: changingActivityMode } = useChangeActivityMode();

  const deviceId = params.deviceId || '';
  const { data: device } = useDevice(deviceId);
  const { data: latestReading } = useLatestDeviceReading(deviceId);
  const signalQuality = getSignalQuality(latestReading?.signal_strength);
  const signalColors = signalQuality ? getSignalQualityColors(signalQuality) : null;

  const cylinderName = useMemo(() => params.name || device?.device_id || 'Kitchen Gas', [params.name, device?.device_id]);
  const status = useMemo(
    () => (device ? Number(device.current_level || 0) : Number(params.fill || '65')),
    [device, params.fill]
  );
  const location = useMemo(() => params.location || device?.mac_address || 'Home - Kitchen', [params.location, device?.mac_address]);
  const strokeDashoffset = circumference - (circumference * status) / 100;

  const canEditActivityMode = !!device && !!clientProfile?.id && device.owner?.id === clientProfile.id;
  const canEditCylinderSize = canEditActivityMode;
  const activityMode = device?.activity_mode || 'medium';
  const currentCylinderSizeLabel = device?.cylinder_size != null ? `${device.cylinder_size} kg` : '—';

  useEffect(() => {
    if (!device) return;
    const nextDraft = device.cylinder_size != null ? String(device.cylinder_size) : '';
    setCylinderSizeDraft(nextDraft);
  }, [device]);

  const activityModes: { key: 'low' | 'medium' | 'high' | 'ultra_high'; title: string; description: string }[] = [
    { key: 'low', title: 'Low usage', description: 'Ideal for low usage. Fetches levels every 12 hours.' },
    { key: 'medium', title: 'Medium usage', description: 'Ideal for families. Fetches every 6 hours (between meals).' },
    { key: 'high', title: 'High usage', description: 'Ideal for restaurants / commercial kitchens. Fetches every 1 hour.' },
    { key: 'ultra_high', title: 'Ultra (demo)', description: 'Better for demo purposes. Fetches every 1 minute.' },
  ];

  const handleSetActivityMode = (nextMode: (typeof activityModes)[number]['key']) => {
    if (!deviceId) return;
    if (!canEditActivityMode) {
      Alert.alert('Not allowed', 'Only the device owner can change the activity mode.');
      return;
    }
    changeActivityMode(
      { id: deviceId, activity_mode: nextMode },
      { onError: () => Alert.alert('Update failed', 'Could not update activity mode. Please try again.') }
    );
  };

  const handleSaveCylinderSize = () => {
    if (!deviceId) return;
    if (!canEditCylinderSize) {
      Alert.alert('Not allowed', 'Only the device owner can change the cylinder size.');
      return;
    }
    const parsedCylinderSizeKg = parseCylinderSizeKg(cylinderSizeDraft);
    if (Number.isNaN(parsedCylinderSizeKg)) {
      Alert.alert('Invalid cylinder size', 'Please enter a valid number (e.g. 6 or 13).');
      return;
    }
    updateDevice(
      { id: deviceId, data: { cylinder_size: parsedCylinderSizeKg } },
      { onError: () => Alert.alert('Update failed', 'Could not update cylinder size. Please try again.') }
    );
  };

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
              onSuccess: () => router.back(),
              onSettled: () => setDisconnecting(false),
            });
          },
        },
      ]
    );
  };

  console.log(latestReading);


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

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.card}>
          {latestReading?.liquid_status === 'no_liquid' && (
            <View style={styles.warningBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#92400E" />
              <Text style={styles.warningText}>
                No liquid detected. Place the monitor correctly under the cylinder.
              </Text>
            </View>
          )}

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

          <View style={styles.readingRow}>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Temp</Text>
              <Text style={styles.readingValue}>
                {latestReading?.temperature ?? '—'}
                {latestReading?.temperature != null ? '°C' : ''}
              </Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Tilt</Text>
              <Text style={styles.readingValue}>
                {latestReading?.tilt_angle != null ? `${latestReading.tilt_angle.toFixed(1)}°` : '—'}
              </Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingLabel}>Signal</Text>
              <Text style={styles.readingValue}>
                {latestReading?.signal_strength ?? '—'}
              </Text>
              {signalQuality && signalColors && (
                <View style={[styles.signalBadge, { backgroundColor: signalColors.bg, borderColor: signalColors.fg }]}>
                  <Text style={[styles.signalBadgeText, { color: signalColors.fg }]}>{getSignalQualityLabel(signalQuality)}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.cylinderSizeSection}>
            <View style={styles.cylinderSizeHeader}>
              <Text style={styles.cylinderSizeTitle}>Cylinder size</Text>
              {updatingDevice && <ActivityIndicator size="small" color={PRIMARY_COLOR} />}
            </View>
            <Text style={styles.cylinderSizeSubtitle}>Used for estimates and refill recommendations.</Text>

            {canEditCylinderSize ? (
              <View style={styles.cylinderSizeEditor}>
                <TextInput
                  style={[styles.cylinderSizeInput, updatingDevice && styles.cylinderSizeInputDisabled]}
                  placeholder="e.g. 6 or 13"
                  placeholderTextColor="#9CA3AF"
                  value={cylinderSizeDraft}
                  onChangeText={setCylinderSizeDraft}
                  keyboardType="numeric"
                  editable={!updatingDevice}
                />
                <AppButton
                  title="Save"
                  onPress={handleSaveCylinderSize}
                  disabled={updatingDevice}
                  style={styles.cylinderSizeSaveBtn}
                />
              </View>
            ) : (
              <>
                <Text style={styles.cylinderSizeReadOnlyValue}>{currentCylinderSizeLabel}</Text>
                <Text style={styles.readOnlyHint}>Only the device owner can change this setting.</Text>
              </>
            )}
          </View>

          <View style={styles.activityModeSection}>
            <View style={styles.activityModeHeader}>
              <Text style={styles.activityModeTitle}>Activity mode</Text>
              {(updatingDevice || changingActivityMode) && <ActivityIndicator size="small" color={PRIMARY_COLOR} />}
            </View>
            <Text style={styles.activityModeSubtitle}>Choose how often the monitor checks levels.</Text>

            <View style={styles.modeOptions}>
              {activityModes.map((m) => {
                const selected = m.key === activityMode;
                const disabled = !canEditActivityMode || updatingDevice || changingActivityMode;
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={[
                      styles.modeOption,
                      selected && styles.modeOptionSelected,
                      disabled && styles.modeOptionDisabled,
                    ]}
                    onPress={() => handleSetActivityMode(m.key)}
                    disabled={disabled}
                  >
                    <Text style={[styles.modeOptionTitle, selected && styles.modeOptionTitleSelected]}>{m.title}</Text>
                    <Text style={[styles.modeOptionDesc, selected && styles.modeOptionDescSelected]}>{m.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {!canEditActivityMode && <Text style={styles.readOnlyHint}>Only the device owner can change this setting.</Text>}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bodyContent: {
    paddingBottom: 28,
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: 10,
    paddingBottom: 20,
  },
  cylinderSizeSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
  },
  cylinderSizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cylinderSizeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cylinderSizeSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  cylinderSizeEditor: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cylinderSizeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    marginRight: 10,
  },
  cylinderSizeInputDisabled: {
    opacity: 0.7,
  },
  cylinderSizeSaveBtn: {
    paddingHorizontal: 14,
  },
  cylinderSizeReadOnlyValue: {
    marginTop: 10,
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
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
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  warningText: {
    flex: 1,
    color: '#92400E',
    fontSize: 12,
    lineHeight: 16,
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
  readingRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
  },
  readingItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  readingValue: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: '#11181C',
  },
  signalBadge: {
    marginTop: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  signalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activityModeSection: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  activityModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityModeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#11181C',
  },
  activityModeSubtitle: {
    marginTop: 4,
    fontSize: 11,
    color: '#6B7280',
  },
  modeOptions: {
    marginTop: 10,
    gap: 10,
  },
  modeOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modeOptionSelected: {
    borderColor: PRIMARY_COLOR,
    backgroundColor: '#EEF2FF',
  },
  modeOptionDisabled: {
    opacity: 0.6,
  },
  modeOptionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#11181C',
  },
  modeOptionTitleSelected: {
    color: PRIMARY_COLOR,
  },
  modeOptionDesc: {
    marginTop: 2,
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 15,
  },
  modeOptionDescSelected: {
    color: '#1F2937',
  },
  readOnlyHint: {
    marginTop: 8,
    fontSize: 11,
    color: '#6B7280',
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
