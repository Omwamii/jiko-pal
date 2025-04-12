import { View, Text, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

const AccountSettingsScreen = () => {
  const scheme = useColorScheme();

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container,  scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='account-settings' options={{ title: 'Account settings' }} />
        <Link href='/profile/change-password'>
            <Text>Change account password</Text>   
        </Link>
        <Link href='/profile/change-avatar'>
            <Text>Change profile avatar</Text>
        </Link>
        <Link href='/profile/change-profile-name'>
            <Text>Change profile name</Text>
        </Link>
        <Link href='/profile/delete'>
            <Text style={styles.deleteAccountBtnText}>Delete my account</Text>
        </Link>
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
