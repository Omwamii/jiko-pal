import { View, StyleSheet } from 'react-native';
import React from 'react';
import { List, MD3Colors, Switch } from 'react-native-paper';

const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <List.Section>
            <List.Subheader>Settings</List.Subheader>
            <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
            <List.Item title="Second Item" left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />} />
        </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Settings;
