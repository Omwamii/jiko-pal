import * as React from 'react';
import Home from '../screens/Home';
import Signup from '../screens/auth/Signup';
import Login from '../screens/auth/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
