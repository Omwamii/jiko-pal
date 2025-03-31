import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import CircleListItem from '../../components/CircleListItem';
import { circles } from '../../constants/data';

const Circles = ({ navigation }) => {
  const scheme = useColorScheme();
  
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
     {circles.length === 0 ? (
      <View>
        <Text style={styles.title}>You have no circles yet</Text>

        <TouchableOpacity onPress={() => navigation.navigate('create-circle')}>
          <Text>Create a circle</Text>
        </TouchableOpacity>

        <Text style={styles.title}>OR</Text>

        <TouchableOpacity onPress={() => navigation.navigate('join-circle')}>
          <Text>Join a circle</Text>
        </TouchableOpacity>
      </View>
     ) : (
      circles.map((circle) => (
        <CircleListItem key={circle.id} circle={circle} />
      ))
     )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  }
});

export default Circles;
