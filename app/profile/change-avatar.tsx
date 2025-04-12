import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, useColorScheme} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack } from 'expo-router';


const ChangeAvatarScreen = () => {
     const [image, setImage] = useState<string | null>(null);
     const scheme = useColorScheme();
  
      const handleSubmit = () => {
          const profileData = {
            image,
          };
      
          console.log('Avatar changed', profileData);
          Alert.alert('Success', 'Avatar changed successfully');
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
      <SafeAreaView style={[styles.container,  scheme === 'dark' ? { backgroundColor: '#222831' } : { backgroundColor: '#fff'}]}>
        <Stack.Screen name='change-avatar' options={{ title: 'Change profile avatar' }} />
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
  
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
  
      </SafeAreaView>
    )
  }
  
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          padding: 20,
          backgroundColor: '#f8f9fb',
        },
      avatar: {
          width: 100,
          height: 100,
          borderRadius: 100,
          alignSelf: 'center',
          marginBottom: 20,
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
        placeholder: {
          backgroundColor: '#eee',
          justifyContent: 'center',
          alignItems: 'center',
        },
        noImageText: {
          color: '#999',
          fontSize: 16,
        },
  });

export default ChangeAvatarScreen;