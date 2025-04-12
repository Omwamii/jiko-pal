import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { cylinders } from '../../constants/data';
import Cylinder from '../../components/Cylinder';
import { useSearchParams } from 'expo-router/build/hooks';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const CylinderDetailsScreen = () => {
    const scheme = useColorScheme();
    const params = useSearchParams();

    const cylinderId = Number(params.get('id'));

    console.log(cylinderId);
    const cylinder = cylinders.find((item) => item.id === cylinderId);
    if (!cylinder) {
        return <Text>No cylinder</Text>;
    }
    
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='cylinder-details' options={{ title: 'Cylinder details' }} />
        <View style={styles.cylinder}>
            <FontAwesome name="arrow-circle-o-left" size={32} color={'#D9D9D9'} />
            <Cylinder level={(cylinder.currentWeight / cylinder.initialWeight) * 100} />
            <FontAwesome name="arrow-circle-o-right" size={32} color={'#D9D9D9'} />
        </View>

        {/* Cylinder details */}
        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Cylinder Name</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>{cylinder.name}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Service Provider</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>{cylinder.provider}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Current Weight</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>{cylinder.currentWeight}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Sensor ID</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>{cylinder.sensorId}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Activity</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>{cylinder.active ? 'Active' : 'Dormant'}</Text>
        </View>

         <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Estimated Time Left</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>3 days</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Expected refill date</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>Jan 23</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Circle</Text>
            <Text style={[styles.detailValue, scheme === 'dark' && { color: '#D9D9D9'}]}>None</Text>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    cylinder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: '#ffffff',
        width: '85%',
        marginTop: '10%',
        marginBottom: 15,
      },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '70%',
        marginVertical: 8,
    },
    detailName: {
        fontSize: 18,
        color: '#D9D9D9',
        fontWeight: 'bold',
    },
    detailValue: {
        fontSize: 15,
        color: '#000000',
    }
})

export default CylinderDetailsScreen;
