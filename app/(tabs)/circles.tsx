import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import CircleListItem from '../../components/CircleListItem';
import { circles } from '../../constants/data';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';


const Circles = () => {
  const scheme = useColorScheme();
  
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
      <Stack.Screen name="circles" options={{ title: 'Your circles' }} />
     {circles.length === 0 ? (
      <View>
        <Text style={styles.title}>You have no circles yet</Text>

        <Link href='/circle/create'>
            <Text>Create a circle</Text>
        </Link>

        <Text style={styles.title}>OR</Text>

        <Link href='/circle/join'>
            <Text>Join a circle</Text>
        </Link>
      </View>
     ) : (
      <View style={styles.circlesList}>
           {circles.map((circle) => (
            <CircleListItem key={circle.id} circle={circle} />
          ))}
      </View>
     )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#D9D9D9',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  circlesList: {
    width: '100%',
    padding: 20,
    height: '100%',
    // borderWidth: 1,
    // borderColor: '#D9D9D9',
    gap: 10,
    // flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default Circles;