import { View, Text, Image, StyleSheet, TouchableOpacity, Clipboard, Alert} from 'react-native';
import React, { useLayoutEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { circles } from '../../constants/data';
import circleImage from '../../../assets/circle.svg';
import { User } from '../../types';

const CircleDetails = ({ route , navigation }) => {
    const circleId = route.params.id;
    // const navigation = useNavigation();
    const circle = circles.find((c) => c.id === circleId) ?? {name: `id: ${circleId}`, members: [], cylinders: [], joiningCode: '', creator: {id: 0, name: ''}};
    const creatorId = 1;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `${circle.name} circle`,
        });
    }, [navigation, circle.name]);

    const handleCopyCode = () => {
        Clipboard.setString(circle.joiningCode); // Copy the code to the clipboard
        Alert.alert('Copied!', 'The joining code has been copied to your clipboard.'); // Show a confirmation message
    };

    const  editCircle = () => {
        navigation.navigate('edit-circle', {id: circleId});
    };

    const deleteCircle = () => {
        // delete the circle
        console.log('Delete the circle');
        Alert.alert('Delete Circle', 'Are you sure you want to delete this circle?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => {
                    console.log('Circle deleted');
                    navigation.goBack();
                },
            },
        ]);
    };

    const leaveCircle = () => {
        // leave the circle
        console.log('Leave the circle');
        Alert.alert('Leave Circle', 'Are you sure you want to leave this circle?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Leave',
                style: 'destructive',
                onPress: () => {
                    console.log('Circle left');
                    navigation.goBack();
                },
            },
        ]);
    };

  return (
    <View style={styles.container}>
        <View>
            <Image source={circleImage} />
        </View>

        <View style={styles.details}>
            <View>
            <Text style={styles.detailsTitle}>Members</Text>
            {circle.members.length > 0 ? (
                circle.members.map((member: User) => (
                <Text key={member.id}>{member.name}</Text>
                ))
            ) : (
                <Text style={styles.noDataText}>No members</Text>
            )}
            </View>

            <View>
                <Text style={styles.detailsTitle}>Cylinders</Text>
                {circle.cylinders.length > 0 ? (
                    circle.cylinders.map((cylinder) => (
                        <Text key={cylinder.id}>{cylinder.name}</Text>
                    ))
                ) : (
                    <Text style={styles.noDataText}>No cylinders</Text>
                )}
            </View>
        </View>

        <View>
            <Text style={styles.codeText}>{circle.joiningCode}</Text>
            <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
        </View>

        <View>
            {circle.creator.id === creatorId ? (
                <View>
                    <TouchableOpacity onPress={editCircle}>
                        <Text style={styles.editCircleText}>Edit circle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteCircle}>
                        <Text style={styles.deleteCircleText}>Delete circle</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={leaveCircle}>
                    <Text style={styles.leaveCircleText}>Leave circle</Text>
                </TouchableOpacity>
            )}
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
    image: {
        width: 100,
        height: 100,
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    detailsTitle: {
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    noDataText: {
        textAlign: 'center',
        color: '#D9D9D9',
    },
    codeText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
    copyButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    copyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    editCircleText: {
        color: '#0000FF',
        fontWeight: 'bold',
    },
    deleteCircleText: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
    leaveCircleText: {
        color: '#FF0000',
        fontWeight: 'bold',
    },
});

export default CircleDetails;
