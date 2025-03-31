import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { users } from '../../constants/data';

const ChangeProfileNameScreen = ({ route, navigation }) => {
    const userId = route.params.userId;
    const scheme = useColorScheme();
    // if (!userId) {
    //     const user = users[0];
    // } else {
    //     const user = users.find((u) => u.id === userId);
    // }
    const [newProfileName, setNewProfileName] = React.useState('');

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
        <TextInput placeholder={'Current name'} value={'Previous name'} disabled={true}/>
        <TextInput placeholder={'Enter new profile name'} value={newProfileName} onChangeText={(text) => setNewProfileName(text)}/>
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

export default ChangeProfileNameScreen;

