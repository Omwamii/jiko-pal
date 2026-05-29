let cachedLocationModule: typeof import('expo-location') | null | undefined;

async function getLocationModule() {
  if (cachedLocationModule !== undefined) return cachedLocationModule;

  try {
    cachedLocationModule = await import('expo-location');
  } catch {
    cachedLocationModule = null;
  }

  return cachedLocationModule;
}

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
  const Location = await getLocationModule();
  if (!Location) {
    throw new Error(
      "Cannot load 'expo-location' (native module 'ExpoLocation' missing). Rebuild/reinstall the native app after installing/upgrading expo-location."
    );
  }
  return Location.requestForegroundPermissionsAsync();
}

export async function getCurrentCoords(): Promise<GeoCoords> {
  const Location = await getLocationModule();
  if (!Location) {
    throw new Error(
      "Cannot load 'expo-location' (native module 'ExpoLocation' missing). Rebuild/reinstall the native app after installing/upgrading expo-location."
    );
  }
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}
