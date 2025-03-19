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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Optional: Use expo-image-picker or another library if needed

const CreateProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Missing Info', 'Please enter your name.');
      return;
    }

    const profileData = {
      name,
      bio,
      profileImage,
    };

    console.log('Profile Created:', profileData);
    Alert.alert('Success', 'Profile created!');
    // Navigate or save to backend
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.placeholder]}>
          <Text style={styles.noImageText}>No Image</Text>
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

export default CreateProfileScreen;

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
