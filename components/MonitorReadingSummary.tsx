import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLatestDeviceReading } from '@/hooks/queries';
import { getSignalQuality, getSignalQualityColors, getSignalQualityLabel } from '@/lib/signalStrength';

type Props = {
  deviceId: string;
  compact?: boolean;
};

export function MonitorReadingSummary({ deviceId, compact }: Props) {
  const { data: latest } = useLatestDeviceReading(deviceId);
  const signalQuality = getSignalQuality(latest?.signal_strength);
  const signalColors = signalQuality ? getSignalQualityColors(signalQuality) : null;

  if (!deviceId) return null;

  const showAnything =
    latest?.temperature != null ||
    latest?.tilt_angle != null ||
    latest?.signal_strength != null ||
    latest?.liquid_status === 'no_liquid';

  if (!showAnything) return null;

  return (
    <View style={styles.wrap}>
      {latest?.liquid_status === 'no_liquid' && (
        <View style={[styles.warningBox, compact && styles.warningBoxCompact]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#92400E" />
          <Text style={styles.warningText}>Place the monitor correctly under the cylinder.</Text>
        </View>
      )}

      {compact ? (
        <View style={[styles.row, styles.rowCompact]}>
          <Text style={styles.item}>
            Temp: {latest?.temperature ?? '—'}
            {latest?.temperature != null ? '°C' : ''}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.item}>Tilt: {latest?.tilt_angle != null ? `${latest.tilt_angle.toFixed(1)}°` : '—'}</Text>
          <Text style={styles.dot}>•</Text>
          <View style={styles.signalWrap}>
            <Text style={styles.item}>Signal: {latest?.signal_strength ?? '—'}</Text>
            {signalQuality && signalColors && (
              <View style={[styles.signalBadge, { backgroundColor: signalColors.bg, borderColor: signalColors.fg }]}>
                <Text style={[styles.signalBadgeText, { color: signalColors.fg }]}>{getSignalQualityLabel(signalQuality)}</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.rowFull}>
          <View style={styles.col}>
            <Text style={styles.itemLabel}>Temp</Text>
            <Text style={styles.itemValue}>
              {latest?.temperature ?? '—'}
              {latest?.temperature != null ? '°C' : ''}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.itemLabel}>Tilt</Text>
            <Text style={styles.itemValue}>
              {latest?.tilt_angle != null ? `${latest.tilt_angle.toFixed(1)}°` : '—'}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.itemLabel}>Signal</Text>
            <View style={styles.signalWrapFull}>
              <Text style={styles.itemValue}>{latest?.signal_strength ?? '—'}</Text>
              {signalQuality && signalColors && (
                <View style={[styles.signalBadge, { backgroundColor: signalColors.bg, borderColor: signalColors.fg }]}>
                  <Text style={[styles.signalBadgeText, { color: signalColors.fg }]}>{getSignalQualityLabel(signalQuality)}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  warningBoxCompact: {
    paddingVertical: 6,
  },
  warningText: {
    flex: 1,
    color: '#92400E',
    fontSize: 11,
    lineHeight: 14,
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    fontSize: 11,
    color: '#6B7280',
  },
  dot: {
    marginHorizontal: 6,
    fontSize: 11,
    color: '#9CA3AF',
  },
  signalWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCompact: {},
  rowFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  col: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  itemValue: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  signalWrapFull: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  signalBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginLeft: 6,
  },
  signalBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
