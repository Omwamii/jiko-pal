import { View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import React from 'react'

const Info = () => {
  const scheme = useColorScheme();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
      <Stack.Screen
        name="app-info"
        options={{
          title: 'Info',
          headerTintColor: scheme === 'dark' ? '#fff' : '#000',
          headerStyle: {
            backgroundColor: scheme === 'dark' ? '#222831' : '#fff',
          },
          headerTitleStyle: {
            color: scheme === 'dark' ? '#fff' : '#000',
          },
        }}
      />
      <Text>Info</Text>
    </SafeAreaView>
  );
};

export default Info;