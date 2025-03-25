import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Switch, Divider, TextInput } from 'react-native-paper';


const NotificationsSettingsScreen = () => {
    // const [changesMade, setChangesMade] = React.useState(false);
    const [refillReminder,setRefillReminder] = React.useState(false);
    const [emailNotifications, setEmailNotifications] = React.useState(false);
    const [smsNotifications, setSmsNotifications] = React.useState(false);
    const [newCircleCylinderAlerts, setNewCircleCylinderAlerts] = React.useState(false);
    const [newCircleMemberAlerts, setNewCircleMemberAlerts] = React.useState(false);
    const [alertThreshold, setAlertThreshold] = React.useState(0);

    const saveChanges = () => {
        console.log('save changes');
    };

  return (
    <View style={styles.container}>
        <View style={styles.settingsItem}>
            <Text>Refill reminders</Text>
            <Switch value={refillReminder} onValueChange={() => setRefillReminder(!refillReminder)} />
        </View>
        <Divider />
        <View style={styles.settingsItem}>
            <Text>Email notifications</Text>
            <Switch value={emailNotifications} onValueChange={() => setEmailNotifications(!emailNotifications)} />
        </View>
        <Divider />
        <View style={styles.settingsItem}>
            <Text>SMS notifications</Text>
            <Switch value={smsNotifications} onValueChange={() => setSmsNotifications(!smsNotifications)} />
        </View>
        <Divider />
        <View style={styles.settingsItem}>
            <Text>New Circle Cylinder Alerts</Text>
            <Switch value={newCircleCylinderAlerts} onValueChange={() => setNewCircleCylinderAlerts(!newCircleCylinderAlerts)} />
        </View>
        <Divider />
        <View style={styles.settingsItem}>
            <Text>New Circle Member Alerts</Text>
            <Switch value={newCircleMemberAlerts} onValueChange={() => setNewCircleMemberAlerts(!newCircleMemberAlerts)} />
        </View>
        <Divider />
        <View style={styles.settingsItem}>
            <Text>Set Alert Threshold</Text>
            <TextInput
                value={alertThreshold.toString()}
                onChangeText={text => setAlertThreshold(parseInt(text))}
                keyboardType='numeric'
            />
        </View>
        <Divider />

        <TouchableOpacity onPress={saveChanges} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    settingsItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    saveBtn: {
        backgroundColor: '#5E60CE',
        width: 250,
        height: 60,
        borderRadius: 30,
        marginVertical: 40,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
    },
});

export default NotificationsSettingsScreen;
