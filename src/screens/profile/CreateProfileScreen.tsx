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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const CreateProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const pickImageFromGallery = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error: ', response.errorMessage || 'Unknown error occurred');
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri ?? null };
        setProfileImage(source.uri);
      }
    });
  };

  // Function to open the camera
  const takePhotoWithCamera = () => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      saveToPhotos: true, // Save the photo to the device's gallery
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        Alert.alert('User cancelled camera');
      } else if (response.errorCode) {
        Alert.alert('Camera Error: ', response.errorMessage || 'Unknown error occurred');
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri ?? null };
        setProfileImage(source.uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Profile</Text>

      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.avatar} />
      ) : (
        <View>
          <TouchableOpacity onPress={takePhotoWithCamera}>
            <Text>Take a photo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImageFromGallery}>
            <View style={[styles.avatar, styles.placeholder]}>
              <FontAwesomeIcon icon={faCircleUser} size={50} color="#999" />
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
