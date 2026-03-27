import { Stack } from 'expo-router';

export default function AddMonitorLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Add Monitor',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="scan" 
        options={{ 
          title: 'Scan Device',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="wifi-setup" 
        options={{ 
          title: 'WiFi Setup',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="details" 
        options={{ 
          title: 'Device Details',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="success" 
        options={{ 
          title: 'Success',
          headerShown: false,
          gestureEnabled: false // Prevent swiping back
        }} 
      />
    </Stack>
  );
}
