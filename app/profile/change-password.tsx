import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { Stack } from 'expo-router';

const ChangePasswordScreen = () => {
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const scheme = useColorScheme();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
        <Stack.Screen name='change-password' options={{ title: 'Change account password' }} />
        <TextInput placeholder={'New Password'} value={newPassword} onChangeText={(text) => setNewPassword(text)}/>
        <TextInput placeholder={'Confirm New Password'} value={confirmNewPassword} onChangeText={(text) => setConfirmNewPassword(text)}/>
        <TouchableOpacity style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    changeBtn: {
        backgroundColor: '#5E60CE',
        width: 250,
        height: 60,
        borderRadius: 30,
    },
    changeBtnText: {
        color: '#FFFFFF',
    },
});

export default ChangePasswordScreen;