import { Stack } from 'expo-router';

export default function MyCircleLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Circle',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="create" 
        options={{ 
          title: 'Create New Circle',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="invite" 
        options={{ 
          title: 'Invite Members',
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
      <Stack.Screen
        name="circle"
        options={{
          title: 'Circle Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="cylinder"
        options={{
          title: 'Cylinder Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="member"
        options={{
          title: 'Member Profile',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
