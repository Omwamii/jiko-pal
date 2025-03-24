import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-native-modal';
import { cylinders } from '../../constants/data';
import { Checkbox, Chip } from 'react-native-paper';

const CreateCircle = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedCylinders, setSelectedCylinders] = useState([]);
    const userId = 1;
    const cylindersCreatedByUser = cylinders.filter(item => item.creatorId === userId);

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

    const toggleCylinderSelection = (cylinderId) => {
        if (selectedCylinders.includes(cylinderId)) {
            // Deselect if already selected
            setSelectedCylinders(selectedCylinders.filter((id) => id !== cylinderId));
        } else {
            // Select if not already selected
            setSelectedCylinders([...selectedCylinders, cylinderId]);
        }
    };

    const generateJoiningCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

  return (
    <View>
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder="Circle Name" />

        <Text style={styles.label}>Cylinders</Text>
        {selectedCylinders.map((selectedCylinder) => (
            <Chip key={selectedCylinder.id} onClose={() => toggleCylinderSelection(selectedCylinder.id)}>{cylinders.find((item) => item.id === selectedCylinder.id).name}</Chip>
        ))}
        <TouchableOpacity onPress={addCylinders} style={styles.addCylindersButton}>
            <FontAwesomeIcon icon={faSquarePlus} size={32} />
        </TouchableOpacity>

        <TouchableOpacity onPress={createCircle} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>

        <Modal isVisible={isModalVisible}>
            <View style={styles.modal}>
                {cylindersCreatedByUser.map((cylinder) => (
                     <View key={cylinder.id} style={styles.cylinderItem}>
                        <Checkbox
                            status={selectedCylinders.includes(cylinder.id) ? 'checked' : 'unchecked'}
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
    </View>
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

export default CreateCircle;
