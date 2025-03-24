import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import CircleListItem from '../../components/CircleListItem';
import { circles } from '../../constants/data';

const Circles = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
    </View>
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
