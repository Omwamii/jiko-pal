import React from 'react';
import RootStack from './src/navigation/Nav';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
