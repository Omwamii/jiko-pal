import React from 'react';
import { RootStack } from './src/navigation/Nav';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import QueryProvider from './src/context/QueryProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer onReady={() => BootSplash.hide({ fade: true })}>
          <RootStack />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
