import * as React from 'react';
import Home from '../screens/Home';
import Signup from '../screens/auth/Signup';
import Login from '../screens/auth/Login';
import Circles from '../screens/circles';
import Settings from '../screens/settings';
import CylinderDetailsScreen from '../screens/cylinder/CylinderDetailsScreen';
import EditCircle from '../screens/circles/EditCircle';
import CreateCircle from '../screens/circles/CreateCircle';
import JoinCircle from '../screens/circles/JoinCircle';
import NotificationsSettingsScreen from '../screens/settings/NotificationsSettingsScreen';
import AccountSettingsScreen from '../screens/settings/AccountSettingsScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicySettingsScreen';
import PairNewSensor from '../screens/cylinder/PairNewSensorScreen';
import Info from '../screens/app/Info';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import ChangeAvatarScreen from '../screens/profile/ChangeAvatarScreen';
import ChangeProfileNameScreen from '../screens/profile/ChangeProfileNameScreen';
import DeleteAccountScreen from '../screens/settings/DeleteAccountScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { View } from 'react-native-animatable';

export function RootStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
      <Stack.Screen name="cylinder-details" component={CylinderDetailsScreen} options={{
        headerTitle: 'Cylinder Details',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="Home" component={Home} options={{
        headerTitle: 'Holla!',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
        headerRight: () => (
          <View>
              <FontAwesomeIcon icon={faBell} size={20}/>
              <FontAwesomeIcon icon={faCircleUser} size={20}/>
          </View>
        ),
      }}/>
      <Stack.Screen name="my-circles" component={Circles} options={{
        headerTitle: 'Your circles',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="edit-circle" component={EditCircle} options={{
        headerTitle: 'Edit Circle',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="create-circle" component={CreateCircle} options={{
        headerTitle: 'Create Circle',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="join-circle" component={JoinCircle} options={{
        headerTitle: 'Join Circle',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="notifications-settings" component={NotificationsSettingsScreen} options={{
        headerTitle: 'Notifications',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="account-settings" component={AccountSettingsScreen} options={{
        headerTitle: 'Account Settings',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="delete-account" component={DeleteAccountScreen} options={{
        headerTitle: 'Delete Account',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="privacy-policy" component={PrivacyPolicyScreen} options={{
        headerTitle: 'Privacy Policy',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="pair-new-sensor" component={PairNewSensor} options={{
        headerTitle: 'Pair New Sensor',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="app-info" component={Info} options={{
        headerTitle: 'App Info',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="change-password" component={ChangePasswordScreen} options={{
        headerTitle: 'Change Password',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="change-avatar" component={ChangeAvatarScreen} options={{
        headerTitle: 'Change Avatar',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      <Stack.Screen name="change-name" component={ChangeProfileNameScreen} options={{
        headerTitle: 'Change Profile Name',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#5E60CE',
        },
      }}/>
      
    </Stack.Navigator>
  );
}

export function RootTabs() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon: () => (
          <FontAwesomeIcon icon={faHome} size={20}/>
        ),
      }}/>
      <Tab.Screen name="Circles" component={Circles} options={{
        tabBarIcon: () => (
          <FontAwesomeIcon icon={faPeopleGroup} size={20}/>
        ),
      }}/>
      <Tab.Screen name="Settings" component={Settings} options={{
        tabBarIcon: () => (
          <FontAwesomeIcon icon={faGear} size={20}/>
        ),
      }}/>
    </Tab.Navigator>
  );
}

