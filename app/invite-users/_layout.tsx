import { Stack } from 'expo-router';

export default function InviteUsersLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Invite Users',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="method" 
        options={{ 
          title: 'Invite Via',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="email" 
        options={{ 
          title: 'Email Invitation',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="sms" 
        options={{ 
          title: 'SMS Invitation',
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
