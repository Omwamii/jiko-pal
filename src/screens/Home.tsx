import { View, StatusBar, useColorScheme, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { cylinders } from '../constants/data';
import Cylinder from '../components/Cylinder';

const Home = ({ navigation }) => {
  const theme = useColorScheme();
  const firstCylinder = cylinders[0];
  console.log(firstCylinder);
  return (
    <View style={styles.container}>
      <View>
        <Cylinder level={(firstCylinder.currentWeight / firstCylinder.initialWeight) * 100} />
        <Text style={styles.cylinderNameText}>{firstCylinder.provider}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Details', {'id': firstCylinder.id})}>
          <Text style={styles.clickableText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme === 'dark' ? '#000' : '#6200ee'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cylinderNameText: {
    color: '#D9D9D9',
    fontSize: 20,
    textAlign: 'center',
  },
  clickableText: {
    color: '#6200ee',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Home;
