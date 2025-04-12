import { Text, 
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    useColorScheme} from 'react-native';
  import React, { useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Stack } from 'expo-router';
  
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const scheme = useColorScheme();
  
    const handleLogin = () => {
      if (email === 'user@example.com' && password === 'password') {
        Alert.alert('Success', 'Signed up successfully!');
        // navigation.navigate('Home') or wherever you want
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    };
  
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <SafeAreaView style={ scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}}>
        <Stack.Screen name='login' options={{ title: 'Login' }} />
        <Text style={styles.title}>Jiko Pal</Text>
        <Text style={styles.subtitle}>Login</Text>
  
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
  
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
  
        <Text style={styles.subtitle}>
          Don't have an account?{' '}
          <Text style={styles.alternateText} onPress={() => Alert.alert('Go to signup')}>
            Sign up
          </Text>
        </Text>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#5E60CE',
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'left',
      color: '#000000',
      marginTop: 20,
      marginBottom: 5,
    },
    input: {
      height: 50,
      borderColor: '#ccc',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#007bff',
      height: 50,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    alternateText: {
      color: '#5E60CE',
    }
  });
  
  export default Login;