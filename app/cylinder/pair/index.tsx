import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

const PairNewSensor = () => {
  const scheme = useColorScheme();
  const [cylinderName, setCylinderName] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [tareWeight, setTareWeight] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');

  const pairSensor = () => {
    console.log('Pairing new sensor');
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff' }]}>
      <Stack.Screen name='pair-sensor' options={{ title: 'Pair a new sensor' }} />
      <TextInput placeholder={'Cylinder Name'} value={cylinderName} onChangeText={(text) => setCylinderName(text)} />
      <TextInput placeholder={'Sensor ID'} value={sensorId} onChangeText={(text) => setSensorId(text)} />
      <TextInput placeholder={'Tare Weight'} value={tareWeight} onChangeText={(text) => setTareWeight(text)} />
      <TextInput placeholder={'Service Provider'} value={serviceProvider} onChangeText={(text) => setServiceProvider(text)} />
      <TouchableOpacity style={styles.pairBtn} onPress={pairSensor}>
        <Text style={styles.pairBtnText}>Pair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pairBtn: {
    backgroundColor: '#5E60CE',
    width: 250,
    height: 60,
    borderRadius: 30,
  },
  pairBtnText: {
    color: '#FFFFFF',
  },
});

export default PairNewSensor;
