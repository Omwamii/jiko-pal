import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const AccountSettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('change-password')}>
          <Text>Change account password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('change-avatar')}>
        <Text>Change profile avatar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('change-name')}>
        <Text>Change profile name</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('delete-account')}>
        <Text style={styles.deleteAccountBtnText}>Delete my account</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  deleteAccountBtnText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default AccountSettingsScreen;
