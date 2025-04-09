// Directly after signing up
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const CreateProfileScreen = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const scheme = useColorScheme();

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter your name.');
      return;
    }

    const profileData = {
      name,
      bio,
      image,
    };

    console.log('Profile Created:', profileData);
    Alert.alert('Success', 'Profile created!');
    // Navigate or save to backend
  };


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });
      
        console.log(result);
      
        if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
    };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <SafeAreaView style={[styles.container, scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
      <Text style={styles.title}>Create Profile</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View>
          <TouchableOpacity onPress={pickImage}>
            <View style={[styles.avatar, styles.placeholder]}>
              <FontAwesome name='user-circle-o' size={50} color="#999" />
              <Text style={styles.noImageText}>Tap to change avatar</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* add an image picker button here */}

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Short Bio"
        value={bio}
        onChangeText={setBio}
        // eslint-disable-next-line react-native/no-inline-styles
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>

        <Text>Skip</Text>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  placeholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
  },
});

export default CreateProfileScreen;
