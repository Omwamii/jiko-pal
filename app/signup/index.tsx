import { Text, 
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    useColorScheme} from 'react-native';
  import React, { useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import { Stack } from 'expo-router';
  
  const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const scheme = useColorScheme();
  
    const handleSignup = () => {
      if (email === 'user@example.com' && password === 'password') {
        Alert.alert('Success', 'Signed up successfully!');
        // navigation.navigate('Home') or wherever you want
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    };
  
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='signup' options={{ title: 'Signup' }} />
        <Text style={styles.title}>Jiko Pal</Text>
        <Text style={styles.subtitle}>Signup</Text>
  
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
  
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />
  
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
  
        <Text style={styles.subtitle}>
          Already have an account?{' '}
          <Text style={styles.alternateText} onPress={() => Alert.alert('Go to login')}>
            Login
          </Text>
        </Text>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
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
  
  export default Signup;