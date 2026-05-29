import React, { useMemo } from 'react';
import { Text, type TextProps } from 'react-native';
import { useLatestDeviceReading } from '@/hooks/queries';

type Props = {
  deviceId: string;
  label?: string;
  suffix?: string;
  missingText?: string;
  valueOnly?: boolean;
} & Omit<TextProps, 'children'>;

function formatCentimeters(valueCm: number) {
  const rounded = Math.round(valueCm * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function RawLevelReading({
  deviceId,
  label = 'Reading',
  suffix = 'cm',
  missingText = '—',
  valueOnly = false,
  ...textProps
}: Props) {
  const { data: latest } = useLatestDeviceReading(deviceId);

  const value = useMemo(() => {
    const rawMm = latest?.level;
    if (typeof rawMm !== 'number' || Number.isNaN(rawMm)) return null;
    return rawMm / 10;
  }, [latest?.level]);

  const rendered = value == null ? missingText : `${formatCentimeters(value)}${suffix}`;
  if (valueOnly) return <Text {...textProps}>{rendered}</Text>;
  return <Text {...textProps}>{label ? `${label}: ` : ''}{rendered}</Text>;
}
