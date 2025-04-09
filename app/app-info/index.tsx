import { View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'

const Info = () => {
  const scheme = useColorScheme();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
      <Text>Info</Text>
    </SafeAreaView>
  );
};

export default Info;