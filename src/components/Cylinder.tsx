import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Cylinder = ({ level }: { level: Number}) => {
  return (
    <View style={styles.cylinder}>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        style={[styles.liquid, { height: `${level}%` }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cylinder: {
    width: 100,
    height: 200,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 50,
    overflow: 'hidden',
  },
  liquid: {
    backgroundColor: 'blue',
    width: '100%',
  },
});

export default Cylinder;