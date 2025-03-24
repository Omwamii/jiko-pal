import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const JoinCircle = () => {
    const joinNewCircle = () => {
        console.log('Joining circle');
    };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Enter joining code" style={styles.input} />
      <TouchableOpacity onPress={joinNewCircle} style={styles.JoinCircleBtn}>
            <Text style={styles.joinCircleText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input:{
        color: '#D9D9D9',
        padding: 5,
    },
    JoinCircleBtn: {
        backgroundColor: '#5E60CE',
        padding: 10,
        borderRadius: 5,
        width: 220,
        height: 70,
    },
    joinCircleText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
    },
});

export default JoinCircle;
