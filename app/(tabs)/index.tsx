import { Image, StyleSheet, Platform, View, Text, useColorScheme, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { cylinders } from '@/constants/data';
import Cylinder from '@/components/Cylinder';
import { FontAwesome } from '@expo/vector-icons';

import { Link } from 'expo-router';

const Home = () => {
  const theme = useColorScheme();
  const firstCylinder = cylinders[0];
  const scheme = useColorScheme();

  console.log(firstCylinder);
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
      <View>
        <View style={styles.cylinder}>
          <FontAwesome name="arrow-circle-o-left" size={32} color={'#D9D9D9'} />
          <Cylinder level={(firstCylinder.currentWeight / firstCylinder.initialWeight) * 100} />
          <FontAwesome name="arrow-circle-o-right" size={32} color={'#D9D9D9'} />
        </View>
        <Text style={styles.cylinderNameText}>{firstCylinder.provider}</Text>
        <Link href={{ 
          pathname: '/cylinder/[id]',
          params: {'id': firstCylinder.id}
        }}>
            <Text style={styles.clickableText}>View Details</Text>
        </Link>
      </View>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme === 'dark' ? '#000' : '#6200ee'} />
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