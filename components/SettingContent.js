/** @format */

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import p from '../constants/image/profile.png';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
export default function SettingContent({ userName }) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(p); // Default profile image

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const logout = () => {
    router.push('/login');
  };
  const editprofile = () => {
    router.push('/editprofile');
  };
  const forgetpassword = () => {
    router.push('/forgetpassword');
  };
  const chooseImage = async () => {
    // Request permission to access the gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'You need to grant permission to access your photos.'
      );
      return;
    } // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.assets[0].uri }); // Set the chosen image
    }
  };
  return (
    <View>
      <View style={styles.imagestuff}>
        <View style={styles.flexer}>
          <View style={styles.setimage}>
            <Image
              source={profileImage}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={{ marginTop: '14' }}>
            <Text style={styles.names}>
              {userName ? userName : 'Demi Bankole'}
            </Text>
          </View>
          <View style={{ marginTop: '14' }}>
            <TouchableOpacity style={styles.update} onPress={chooseImage}>
              <Text style={styles.updatetext}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginTop: '30' }}>
        <View>
          <Text style={styles.othset}>Settings</Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: '50', width: '100%' }}
          onPress={editprofile}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <FontAwesome5 name="user-circle" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Edit Profile</Text>
                <Text style={styles.ed2}>Update your profile</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: '50', width: '100%' }}
          onPress={forgetpassword}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="password" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Change Password</Text>
                <Text style={styles.ed2}>Update your password here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: '50', width: '100%' }}
          onPress={logout}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="logout" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Log out</Text>
                <Text style={styles.ed2}>Log out of your account here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imagestuff: {
    width: '100%',
    // height: 200,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
    marginTop: 30, // Use a number instead of a string
  },
  flexer: {
    justifyContent: 'center', // Centers content vertically inside the flexer
    alignItems: 'center', // Centers content horizontally inside the flexer
    width: '60%',

    padding: 10, // Add padding to better fit the content
  },
  setimage: {
    width: '100',
    height: '100',
    borderRadius: 50,
  },
  image: {
    width: '100%', // Matches the parent View's width
    height: '100%', // Matches the parent View's height
    borderRadius: 50,
  },
  names: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 19,
    color: '#2E2E2E',
  },
  update: {
    width: '123',
    height: '41',
    borderRadius: '9',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatetext: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
  },
  othset: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    color: '#2E2E2E',
  },
  fiue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10',
  },
  flexer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roundz: {
    width: '37.56',
    height: '37.56',
    borderRadius: '50%',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editt: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    color: '#000000',
  },
  ed2: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 19,
    color: '#888888',
  },
});
