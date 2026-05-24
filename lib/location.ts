import * as Location from 'expo-location';

export type GeoCoords = {
  latitude: number;
  longitude: number;
};

export function isTimestampStale(timestamp: string | null | undefined, staleMinutes: number) {
  if (!timestamp) return true;
  const ms = Date.parse(timestamp);
  if (Number.isNaN(ms)) return true;
  return Date.now() - ms > staleMinutes * 60_000;
}

export async function requestForegroundLocationPermission() {
  return Location.requestForegroundPermissionsAsync();
}

export async function getCurrentCoords(): Promise<GeoCoords> {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

