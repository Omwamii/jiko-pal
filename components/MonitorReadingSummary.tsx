import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLatestDeviceReading } from '@/hooks/queries';
import { getSignalQuality, getSignalQualityColors, getSignalQualityLabel } from '@/lib/signalStrength';

type Props = {
  deviceId: string;
  compact?: boolean;
};

function formatDaysLabel(days: number) {
  return `${days} day${days === 1 ? '' : 's'}`;
}

function getForecastSummary(latest: unknown) {
  const row = latest as
    | {
        estimated_days_left?: number | null;
        depletion_forecast_status?: string;
        depletion_forecast_message?: string | null;
      }
    | undefined;

  const status = row?.depletion_forecast_status;
  const days = row?.estimated_days_left ?? null;

  if (typeof days === 'number') {
    if (status === 'depleted' || days <= 0) {
      return {
        short: '0d',
        title: 'Depleted',
        detail: row?.depletion_forecast_message ?? 'Cylinder appears depleted.',
        tone: 'danger' as const,
      };
    }
    return {
      short: `${days}d`,
      title: `Est. ${formatDaysLabel(days)} left`,
      detail: row?.depletion_forecast_message ?? 'Estimated days left if usage continues at the recent rate.',
      tone: 'neutral' as const,
    };
  }

  if (status === 'no_recent_activity') {
    return { short: '—', title: 'No recent usage', detail: row?.depletion_forecast_message ?? null, tone: 'muted' as const };
  }
  if (status === 'insufficient_data') {
    return { short: '—', title: 'Need more data', detail: row?.depletion_forecast_message ?? null, tone: 'muted' as const };
  }
  if (status === 'invalid_window') {
    return { short: '—', title: 'Forecast unavailable', detail: row?.depletion_forecast_message ?? null, tone: 'muted' as const };
  }

  if (row?.depletion_forecast_message) {
    return { short: '—', title: 'Forecast', detail: row.depletion_forecast_message, tone: 'muted' as const };
  }

  return null;
}

export function MonitorReadingSummary({ deviceId, compact }: Props) {
  const { data: latest } = useLatestDeviceReading(deviceId);
  const signalQuality = getSignalQuality(latest?.signal_strength);
  const signalColors = signalQuality ? getSignalQualityColors(signalQuality) : null;
  const forecast = getForecastSummary(latest);

  if (!deviceId) return null;

  const showAnything =
    latest?.temperature != null ||
    latest?.tilt_angle != null ||
    latest?.signal_strength != null ||
    latest?.liquid_status === 'no_liquid' ||
    !!forecast;

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
          {forecast && (
            <>
              <Text style={[styles.item, forecast.tone === 'danger' ? styles.itemDanger : styles.itemMuted]}>ETA: {forecast.short}</Text>
              <Text style={styles.dot}>•</Text>
            </>
          )}
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
        <>
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
              <Text style={styles.itemValue}>{latest?.tilt_angle != null ? `${latest.tilt_angle.toFixed(1)}°` : '—'}</Text>
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

          {forecast && (
            <View style={styles.forecastRow}>
              <MaterialCommunityIcons
                name={forecast.tone === 'danger' ? 'alert-circle-outline' : 'clock-outline'}
                size={16}
                color={forecast.tone === 'danger' ? '#DC2626' : '#6B7280'}
              />
              <Text style={[styles.forecastText, forecast.tone === 'danger' ? styles.forecastTextDanger : styles.forecastTextMuted]}>
                {forecast.title}
              </Text>
              {forecast.detail ? <Text style={styles.forecastDetail}> • {forecast.detail}</Text> : null}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 3,
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
  itemMuted: {
    color: '#6B7280',
  },
  itemDanger: {
    color: '#DC2626',
    fontWeight: '700',
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
  forecastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  forecastText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '700',
  },
  forecastTextMuted: {
    color: '#6B7280',
  },
  forecastTextDanger: {
    color: '#DC2626',
  },
  forecastDetail: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
