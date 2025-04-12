import React from 'react';
import { View, StyleSheet, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';

const Cylinder = ({ level }: { level: number }) => {
  const roundedLevel = Math.round(level);
  return (
    <View style={styles.cylinder}>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        style={[styles.liquid, { height: `${roundedLevel}%` }]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>{`${roundedLevel}`}%</Text>
      </View>
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
  textContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white', // Change color if needed for better visibility
  },
});

export default Cylinder;