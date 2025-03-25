import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';

const ChangePasswordScreen = () => {
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  return (
    <View>
        <TextInput placeholder={'New Password'} value={newPassword} onChangeText={(text) => setNewPassword(text)}/>
        <TextInput placeholder={'Confirm New Password'} value={confirmNewPassword} onChangeText={(text) => setConfirmNewPassword(text)}/>
        <TouchableOpacity style={styles.changeBtn}>
            <Text style={styles.changeBtnText}>Change</Text>
        </TouchableOpacity>
    </View>
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
