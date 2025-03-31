import { View, StyleSheet, Text, TouchableOpacity, useColorScheme} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { Switch, Divider } from 'react-native-paper';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Settings = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const scheme = useColorScheme();

  const onToggleSwitch = () => setIsDarkMode(!isDarkMode);

  const logout = () => {
    console.log('logging out');
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <View style={styles.settingsItem}>
            <Text>Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={onToggleSwitch} />
        </View>
        <Divider />
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('notifications-settings')}>
            <Text>Notifications</Text>
            <FontAwesomeIcon icon={faChevronRight} size={32}/>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('privacy-policy')}>
            <Text>Privacy Policy</Text>
            <FontAwesomeIcon icon={faChevronRight} size={32}/>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('account-settings')}>
            <Text>Account Settings</Text>
            <FontAwesomeIcon icon={faChevronRight} size={32}/>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('pair-new-sensor')}>
            <Text>Pair new sensor</Text>
            <FontAwesomeIcon icon={faChevronRight} size={32}/>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('app-info')}>
            <Text>App info</Text>
            <FontAwesomeIcon icon={faChevronRight} size={32}/>
        </TouchableOpacity>
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
