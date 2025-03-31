import { View, Text, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const AccountSettingsScreen = ({ navigation }) => {
  const scheme = useColorScheme();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container,  scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
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
    </SafeAreaView>
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
