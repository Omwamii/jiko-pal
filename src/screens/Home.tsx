import { View, StatusBar, useColorScheme, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { cylinders } from '../constants/data';
import Cylinder from '../components/Cylinder';
import { RootTabs } from '../navigation/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

const Home = ({ navigation }) => {
  const theme = useColorScheme();
  const firstCylinder = cylinders[0];
  const scheme = useColorScheme();

  console.log(firstCylinder);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
      <View>
        <View style={styles.cylinder}>
          <FontAwesomeIcon icon={faCircleArrowLeft} size={32} color={'#D9D9D9'} />
          <Cylinder level={(firstCylinder.currentWeight / firstCylinder.initialWeight) * 100} />
          <FontAwesomeIcon icon={faCircleArrowRight} size={32} color={'#D9D9D9'} />
        </View>
        <Text style={styles.cylinderNameText}>{firstCylinder.provider}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('cylinder-details', {'id': firstCylinder.id})}>
          <Text style={styles.clickableText}>View Details</Text>
        </TouchableOpacity>
      </View>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme === 'dark' ? '#000' : '#6200ee'} />
      <RootTabs />
    </SafeAreaView>
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
  cylinder: {
    justifyContent: 'space-between',
  },
});

export default Home;
