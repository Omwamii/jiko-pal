import { PermissionsAndroid, Platform } from 'react-native';
import type { WifiEntry } from 'react-native-wifi-reborn';
import NativeWifiManager from 'react-native-wifi-reborn';

const SENSOR_PREFIX = 'LPG-Tank-';

const WifiManager = Platform.OS === 'web' ? null : NativeWifiManager;

function getWifiManager() {
  if (!WifiManager) {
    throw new Error('Wi-Fi management is not supported on this platform.');
  }
  return WifiManager;
}

export type SensorWifi = {
  ssid: string;
  bssid: string;
  level: number;
};

export const getTankIdFromSSID = (ssid: string) => ssid.replace(SENSOR_PREFIX, '').trim();

const requestAndroidWifiPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  const permissions = [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] as string[];
  const nearbyWifiPermission = (PermissionsAndroid.PERMISSIONS as Record<string, string>).NEARBY_WIFI_DEVICES as string | undefined;

  if (nearbyWifiPermission) {
    permissions.push(nearbyWifiPermission);
  }

  const result = await PermissionsAndroid.requestMultiple(permissions as never);

  return permissions.every(
    (permission) => result[permission as keyof typeof result] === PermissionsAndroid.RESULTS.GRANTED
  );
};

const dedupeBySsid = (networks: WifiEntry[]): SensorWifi[] => {
  const bestBySsid = new Map<string, SensorWifi>();

  for (const network of networks) {
    if (!network.SSID || !network.SSID.startsWith(SENSOR_PREFIX)) continue;

    const previous = bestBySsid.get(network.SSID);
    if (!previous || network.level > previous.level) {
      bestBySsid.set(network.SSID, {
        ssid: network.SSID,
        bssid: network.BSSID,
        level: network.level,
      });
    }
  }

  return [...bestBySsid.values()].sort((a, b) => b.level - a.level);
};

export const scanSensorNetworks = async (): Promise<SensorWifi[]> => {
  if (Platform.OS !== 'android') {
    return [];
  }

  const granted = await requestAndroidWifiPermissions();
  if (!granted) {
    throw new Error('Location permission is required to scan Wi-Fi networks.');
  }

  const wifiManager = getWifiManager();
  const isWifiEnabled = await wifiManager.isEnabled();
  if (!isWifiEnabled) {
    wifiManager.setEnabled(true);
  }

  try {
    const scanned = await wifiManager.reScanAndLoadWifiList();
    return dedupeBySsid(scanned);
  } catch {
    const scanned = await wifiManager.loadWifiList();
    return dedupeBySsid(scanned);
  }
};

export const connectToSensorNetwork = async (ssid: string) => {
  const wifiManager = getWifiManager();

  if (Platform.OS === 'ios') {
    await wifiManager.connectToSSID(ssid);
    return;
  }

  await wifiManager.connectToProtectedWifiSSID({
    ssid,
    password: null,
    isWEP: false,
    isHidden: false,
    timeout: 20,
  });

  // Keep requests on sensor Wi-Fi while provisioning.
  await wifiManager.forceWifiUsageWithOptions(true, { noInternet: true });
};

export const stopForcingWifiUsage = async () => {
  if (Platform.OS !== 'android' || !WifiManager) return;
  await WifiManager.forceWifiUsageWithOptions(false, { noInternet: true });
};
