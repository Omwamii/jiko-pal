import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { cylinders } from '../../constants/data';
import Cylinder from '../../components/Cylinder';

const CylinderDetailsScreen = ({ route }) => {
    const cylinderId = route.params.id;
    console.log(cylinderId);
    const cylinder = cylinders.find((item) => item.id === cylinderId);
    if (!cylinder) {
        return <Text>No cylinder</Text>;
    }
  return (
    <View style={styles.container}>
        <Cylinder level={(cylinder.currentWeight / cylinder.initialWeight) * 100} />

        {/* Cylinder details */}
        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Cylinder Name</Text>
            <Text style={styles.detailValue}>{cylinder.name}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Service Provider</Text>
            <Text style={styles.detailValue}>{cylinder.provider}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Current Weight</Text>
            <Text style={styles.detailValue}>{cylinder.currentWeight}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Sensor ID</Text>
            <Text style={styles.detailValue}>{cylinder.sensorId}</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Activity</Text>
            <Text style={styles.detailValue}>{cylinder.active ? 'Active' : 'Dormant'}</Text>
        </View>

         <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Estimated Time Left</Text>
            <Text style={styles.detailValue}>3 days</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Expected refill date</Text>
            <Text style={styles.detailValue}>Jan 23</Text>
        </View>

        <View style={styles.detailsRow}>
            <Text style={styles.detailName}>Circle</Text>
            <Text style={styles.detailValue}>None</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: 10,
    },
    detailName: {
        fontSize: 18,
        color: '#D9D9D9',
    },
    detailValue: {
        fontSize: 18,
        color: '#000000',
    }
})

export default CylinderDetailsScreen;
