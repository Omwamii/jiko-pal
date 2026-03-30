import { Stack } from 'expo-router';

export default function VendorsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="detail" />
      <Stack.Screen name="reviews" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="refill-select" />
      <Stack.Screen name="refill-date" />
      <Stack.Screen name="refill-success" />
    </Stack>
  );
}
