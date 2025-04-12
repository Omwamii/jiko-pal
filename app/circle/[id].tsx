import { View, Text, Image, StyleSheet, TouchableOpacity, Clipboard, Alert, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useLayoutEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { circles } from '../../constants/data';
import { User } from '@/types';
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks';
import { Link, Redirect } from 'expo-router';
import { useRouter } from 'expo-router/build/hooks';
import { Stack } from 'expo-router';

const CircleDetails = () => {
    const params = useSearchParams();
    const router = useRouter();
    const scheme = useColorScheme();

    const circleId = Number(params.get('id'));
    const circle = circles.find((c) => c.id === circleId) ?? {name: `id: ${circleId}`, members: [], cylinders: [], joiningCode: '', creator: {id: 0, name: ''}};
    const creatorId = 1;

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         title: `${circle.name} circle`,
    //     });
    // }, [navigation, circle.name]);

    const handleCopyCode = () => {
        Clipboard.setString(circle.joiningCode); // Copy the code to the clipboard
        Alert.alert('Copied!', 'The joining code has been copied to your clipboard.'); // Show a confirmation message
    };

    const  editCircle = () => {
        router.push({
            pathname: "/circle/edit/[id]",
            params: { id: circleId },
          });
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
                    router.back()
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
                    router.back();
                },
            },
        ]);
    };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='circle-details' options={{ title: `${circle.name}'s circle details` }} />
        <Image source={require('@/assets/images/circle.png')} style={{ width: 250, height: 250, resizeMode: 'contain' }} />

        <View style={styles.details}>
            <View>
            <Text style={[styles.detailsTitle, scheme === "dark" && { color: '#D9D9D9' }]}>Members</Text>
            {circle.members.length > 0 ? (
                circle.members.map((member: User) => (
                <Text key={member.id} style={scheme === "dark" ? { color: '#D9D9D9'} : { color: '#000000'}}>{member.name}</Text>
                ))
            ) : (
                <Text style={[styles.noDataText, scheme === "dark" && { color: '#D9D9D9' }]}>No members</Text>
            )}
            </View>

            <View>
                <Text style={[styles.detailsTitle, scheme === "dark" && { color: '#D9D9D9' }]}>Cylinders</Text>
                {circle.cylinders.length > 0 ? (
                    circle.cylinders.map((cylinder) => (
                        <Text key={cylinder.id} style={scheme === "dark" ? { color: '#D9D9D9'} : { color: '#000000'}}>{cylinder.name}</Text>
                    ))
                ) : (
                    <Text style={[styles.noDataText, scheme === "dark" && { color: '#D9D9D9'}]}>No cylinders</Text>
                )}
            </View>
        </View>

        <View>
            <Text style={[styles.codeText, scheme === "dark" && { color: '#D9D9D9'} ]}>{circle.joiningCode}</Text>
            <TouchableOpacity onPress={handleCopyCode} style={styles.copyButton}>
                <Text style={[styles.copyButtonText, scheme === "dark" && { color: '#D9D9D9'} ]}>Copy</Text>
            </TouchableOpacity>
        </View>

        <View>
            {circle.creator.id === creatorId ? (
                <View>
                    <TouchableOpacity onPress={editCircle}>
                        <Text style={[styles.editCircleText, scheme === "dark" && { color: '#D9D9D9'}]}>Edit circle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteCircle}>
                        <Text style={[styles.deleteCircleText, scheme === "dark" && {color: '#D9D9D9'}]}>Delete circle</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={leaveCircle}>
                    <Text style={[styles.leaveCircleText, scheme === "dark" && { color: '#D9D9D9'}]}>Leave circle</Text>
                </TouchableOpacity>
            )}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        // borderWidth: 1,
        // borderColor: '#D9D9D9',
        width: '70%',
    },
    detailsTitle: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 16,
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
