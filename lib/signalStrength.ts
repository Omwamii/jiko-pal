export type SignalQuality = 'low' | 'medium' | 'good';

export function getSignalQuality(signalStrength?: number | null): SignalQuality | null {
  if (signalStrength == null) return null;
  if (signalStrength >= 1200) return 'good';
  if (signalStrength >= 800) return 'medium';
  return 'low';
}

export function getSignalQualityLabel(quality: SignalQuality): string {
  switch (quality) {
    case 'good':
      return 'Good';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
  }
}

export function getSignalQualityColors(quality: SignalQuality): { fg: string; bg: string } {
  switch (quality) {
    case 'good':
      return { fg: '#10B981', bg: '#D1FAE5' };
    case 'medium':
      return { fg: '#F59E0B', bg: '#FEF3C7' };
    case 'low':
      return { fg: '#EF4444', bg: '#FEE2E2' };
  }
}

