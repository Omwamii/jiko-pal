import { View, StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Switch, Divider } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Stack } from 'expo-router';

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const scheme = useColorScheme();

  const onToggleSwitch = () => setIsDarkMode(!isDarkMode);

  const logout = () => {
    console.log('logging out');
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='settings' options={{ title: 'Settings' }} />
        <View style={styles.settingsItem}>
            <Text>Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={onToggleSwitch} />
        </View>
        <Divider />
        <Link href='/settings/notifications' style={styles.settingsItem}>
            <Text>Notifications</Text>
            <FontAwesome name="chevron-right" sie={32} />
        </Link>

        <Divider />
        <Link href='/settings/privacy-policy' style={styles.settingsItem}>
            <Text>Privacy Policy</Text>
            <FontAwesome name="chevron-right" sie={32} />
        </Link>
        
        <Divider />
        <Link href='/settings/account' style={styles.settingsItem}>
            <Text>Account Settings</Text>
            <FontAwesome name="chevron-right" sie={32} />
        </Link>

        <Divider />
        <Link href='/cylinder/pair' style={styles.settingsItem}>
            <Text>Pair new sensor</Text>
            <FontAwesome name="chevron-right" sie={32} />
        </Link>
        
        <Divider />
        <Link href='/app-info' style={styles.settingsItem}>
            <Text>App info</Text>
            <FontAwesome name="chevron-right" sie={32} />
        </Link>

        <Divider />
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text>Logout</Text>
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
    settingsItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoutBtn: {
      backgroundColor: '#FF0000',
      width: 260,
      height: 75,
      marginVertical: 20,
    },
    logoutBtnText: {
      color: '#FFFFFF',
    },
});

export default Settings;
