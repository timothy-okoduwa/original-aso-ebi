import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  LexendDeca_400Regular,
} from '@expo-google-fonts/lexend-deca';
import {
  KumbhSans_100Thin,
  KumbhSans_200ExtraLight,
  KumbhSans_300Light,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
  KumbhSans_900Black,
} from '@expo-google-fonts/kumbh-sans';
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
  Lora_400Regular_Italic,
  Lora_500Medium_Italic,
  Lora_600SemiBold_Italic,
  Lora_700Bold_Italic,
} from '@expo-google-fonts/lora';

export default function createaccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputFocused2, setIsInputFocused2] = useState(false);

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };
  const handleFocus2 = () => {
    setIsInputFocused2(true);
  };

  const handleBlur2 = () => {
    setIsInputFocused2(false);
  };
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
    Lora_500Medium_Italic,
    Lora_600SemiBold_Italic,
    Lora_700Bold_Italic,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.main}>
        <View style={styles.flex}>
          <Link href="/onboarding">
            {' '}
            <View>
              <Text>
                <AntDesign name="arrowleft" size={24} color="black" />
              </Text>
            </View>
            <View style={styles.testx}>
              <Text style={styles.reegister}>Register</Text>
            </View>
          </Link>
        </View>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Email and Password</Text>
          </View>
          <View style={{ marginTop: '30px' }}>
            <Text style={styles.greetings}>
              Welcome to Original Aso-Ebi! Please provide your email address and
              create a password to create your account.
            </Text>
          </View>
          <View style={styles.inputs}>
            <View style={{ marginTop: '20px' }}>
              <Text style={styles.labell}>Full Name</Text>
              <View style={{ marginTop: '16px' }}>
                <TextInput
                  style={styles.inputt}
                  placeholder="Jhon Doe"
                  keyboardType="default"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={{ marginTop: '20px' }}>
              <Text style={styles.labell}>Email</Text>
              <View style={{ marginTop: '16px' }}>
                <TextInput
                  style={styles.inputt}
                  placeholder="youremail@here.com"
                  keyboardType="email-address" // Change this to 'password' or 'default' for different types
                  placeholderTextColor="#999" // Change placeholder text color here
                />
              </View>
            </View>
            <View style={{ marginTop: '20px' }}>
              <Text style={styles.labell}>Password</Text>
              <View style={{ marginTop: '16px' }}>
                <View
                  style={[
                    styles.scares,
                    {
                      borderColor: isInputFocused ? 'black' : 'gray',
                      borderWidth: isInputFocused ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inpu2}
                      placeholder="*********"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#999"
                      underlineColorAndroid="transparent"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ marginTop: '20px' }}>
              <Text style={styles.labell}>Confirm Password</Text>
              <View style={{ marginTop: '16px' }}>
                <View
                  style={[
                    styles.scares,
                    {
                      borderColor: isInputFocused2 ? 'black' : 'gray',
                      borderWidth: isInputFocused2 ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.inpu2}
                      placeholder="*********"
                      secureTextEntry={!showPassword2}
                      placeholderTextColor="#999"
                      underlineColorAndroid="transparent"
                      onFocus={handleFocus2}
                      onBlur={handleBlur2}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => setShowPassword2(!showPassword2)}
                    >
                      <Feather
                        name={showPassword2 ? 'eye' : 'eye-off'}
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  main: {
    padding: 15,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testx: {
    marginLeft: 10,
  },
  reegister: {
    fontFamily: ' KumbhSans_500Medium',
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 24,
  },
  createups: {
    marginTop: 70,
  },
  enadp: {
    fontFamily: '  Lora_500Medium',
    fontSize: 20,
    fontWeight: 500,
    lineHeight: 24,
    textAlign: 'left',
    color: '#1D1D1D',
  },
  greetings: {
    fontFamily: ' KumbhSans_400Regular',
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 24,
    textAlign: 'left',
    color: '#6B6B6B',
  },
  inputs: {
    marginTop: 30,
  },
  labell: {
    // marginBottom: ,
    fontFamily: ' LexendDeca_400Regular',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 20,
    textAlign: 'left',
    color: '#6B6B6B',
  },
  inputt: {
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  scares: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    width: '100%',
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,

    paddingRight: 20,
  },
  inputContainer: {
    flex: 1, // Make the container flex to fill the available space
  },
  inpu2: {
    width: 'fit-content',
    borderColor: 'transparent', // Set border color to transparent
    borderWidth: 0, // Set border width to 0
    outlineColor: 'transparent', // Set outline color to transparent
    outlineWidth: 0, // Set outline width to 0

    height: 50,
    width: 'auto',
    paddingLeft: 20,
  },
});
