import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Switch, Divider } from 'react-native-paper';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const Settings = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const onToggleSwitch = () => setIsDarkMode(!isDarkMode);

  const logout = () => {
    console.log('logging out');
  };

  return (
    <View style={styles.container}>
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
    </View>
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
