import { View, Text, TouchableOpacity, StyleSheet, Alert, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { TextInput, Checkbox } from 'react-native-paper';


const DeleteAccountScreen = () => {
  const [deleteReason, setDeleteReason] = React.useState('');
  const [isChecked, setIsChecked] = React.useState(false);
  const scheme = useColorScheme();

  const deleteAccount = () => {
    if (deleteReason === '') {
      Alert.alert('Please provide a reason for deleting your account.');
      return;
    }
    if (!isChecked) {
      Alert.alert('Please confirm that you understand the consequences of deleting your account.');
      return;
    }
    console.log('Deleting...');
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
      <TextInput onChangeText={(text) => setDeleteReason(text)} value={deleteReason} placeholder={'Enter reason for deleting account'}/>
      <Checkbox.Item label="I understand that deleting my account is permanent and cannot be undone." status={isChecked ? 'checked' : 'unchecked'} onPress={() => setIsChecked(!isChecked)}/>
      <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
        <Text style={styles.deleteBtnText}>Delete</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#FF0000',
    width: 250,
    height: 60,
  },
  deleteBtnText: {
    color: '#FFFFFF',
  },
});

export default DeleteAccountScreen;
