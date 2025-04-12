import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { cylinders } from '@/constants/data'
import { FontAwesome } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import { Cylinder } from '@/types';
import { Stack } from 'expo-router';


const EditCircle = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedCylinders, setSelectedCylinders] = useState<Cylinder[]>([]);
    const userId = 1;
    const cylindersCreatedByUser = cylinders.filter(item => item.creatorId === userId);
    const scheme = useColorScheme();

    const addCylinders = () => {
        console.log('Add Cylinders');
        setModalVisible(true);
    };

    const saveCylinders = () => {
        console.log('Save Cylinders');
        setModalVisible(false);
    };

    const createCircle = () => {
        console.log('Create Circle');
    };

    const toggleCylinderSelection = (cylinderId: number) => {
        // if (selectedCylinders.includes(cylinderId)) {
        //     // Deselect if already selected
        //     setSelectedCylinders(selectedCylinders.filter((id) => id !== cylinderId));
        // } else {
        //     // Select if not already selected
        //     setSelectedCylinders([...selectedCylinders, cylinderId]);
        // }
    };

    const getCylinder = (id: number) => {
        return cylinders.find((item) => item.id === id);
    }

    const generateJoiningCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
        <Stack.Screen name='edit-circle' options={{ title: 'Edit circle details' }} />
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder="Circle Name" />

        <Text style={styles.label}>Cylinders</Text>
        <TouchableOpacity onPress={addCylinders} style={styles.addCylindersButton}>
            <FontAwesome name='plus-square-o' size={32} />
        </TouchableOpacity>

        <TouchableOpacity onPress={createCircle} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>

        <Modal 
            transparent={true}
            visible={isModalVisible}    
            animationType="slide"
        >
            <View style={styles.modal}>
                {cylindersCreatedByUser.map((cylinder) => (
                     <View key={cylinder.id} style={styles.cylinderItem}>
                        <Checkbox
                            status={selectedCylinders.includes(getCylinder(cylinder.id) ?? {} as Cylinder) ? 'checked' : 'unchecked'}
                            onPress={() => toggleCylinderSelection(cylinder.id)}
                            color={'#5E60CE'}
                            uncheckedColor={'#FFFFFF'}
                        />
                     <Text style={styles.cylinderName}>{cylinder.name}</Text>
                 </View>
                ))}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveCylinders}>
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    createButton: {
        backgroundColor: '#5E60CE',
        width: 220,
        height: 75,
    },
    createButtonText: {
        color: '#FFFFFF',
    },
    label: {
        fontSize: 20,
        color: '#000000',
    },
    addCylindersButton: {
        marginTop: 20,
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    cylinderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cylinderName: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default EditCircle;