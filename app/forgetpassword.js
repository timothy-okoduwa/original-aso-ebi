import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';
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

export default function forgetpassword() {
  const router = useRouter();
  // State variables to store input values and corresponding error messages

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // Validation functions
  // const gotoresetlink = () => {
  //   router.push('/resetlinksent');
  // };

  const validateEmail = () => {
    if (email.trim() === '') {
      setEmailError('Email is required');
      return false;
    }

    const hasAtSymbol = email.includes('@');
    const hasDotCom = email.endsWith('.com');

    if (!hasAtSymbol) {
      setEmailError('Email is missing "@" symbol');
      return false;
    }

    if (!hasDotCom) {
      setEmailError('Email is missing ".com"');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }

    setEmailError('');
    return true;
  };

  // Handle submit button press
  const handleCreateAccount = () => {
    const isEmailValid = validateEmail();

    // If all fields are valid, submit the form
    if (isEmailValid) {
      // Submit the form or navigate to the next screen
      console.log('Form submitted successfully');
      router.push('/resetlinksent');
    }
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
      <StatusBar style="dark" />
      <View style={styles.main}>
        <View style={styles.flex}>
          <Link href="/onboarding">
            {' '}
            <View>
              <AntDesign name="arrowleft" size={24} color="black" />
            </View>
            <View style={styles.testx}>
              <Text style={styles.reegister}>forget Password</Text>
            </View>
          </Link>
        </View>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Email and Password</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.greetings}>
              Welcome to Original Aso-Ebi! Please provide your email address and
              create a password to create your account.
            </Text>
          </View>
          <View style={styles.inputs}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labell}>Email</Text>
              <View style={{ marginTop: 16 }}>
                <TextInput
                  style={styles.inputt}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="youremail@here.com"
                  keyboardType="email-address" // Change this to 'password' or 'default' for different types
                  placeholderTextColor="#999" // Change placeholder text color here
                />
              </View>
              <Text style={styles.error}>{emailError}</Text>
            </View>

            <View style={{ marginBottom: 30 }}>
              <TouchableOpacity
                style={styles.create}
                onPress={handleCreateAccount}
              >
                <Text style={{ color: 'white' }}>Done</Text>
              </TouchableOpacity>
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
    marginTop: '30px',
  },
  testx: {
    marginLeft: 10,
  },
  reegister: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,

    lineHeight: 24,
  },
  createups: {
    marginTop: 50,
  },
  enadp: {
    fontFamily: 'Lora_500Medium',
    fontSize: 20,

    lineHeight: 24,
    textAlign: 'left',
    color: '#1D1D1D',
  },
  greetings: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,

    lineHeight: 24,
    textAlign: 'left',
    color: '#6B6B6B',
  },
  inputs: {
    marginTop: 30,
  },
  labell: {
    // marginBottom: ,
    fontFamily: 'LexendDeca_400Regular',
    fontSize: 16,

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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: 'blue', // Adjust color as needed
  },
  label: {
    marginLeft: 15,
    width: '80%',
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 14,

    lineHeight: 18,
    textAlign: 'left',
    color: '#1D1D1D',
  },
  others: {
    fontFamily: 'KumbhSans_500Medium',

    color: '#007F5F',
  },
  create: {
    fontFamily: 'LexendDeca_400Regular',
    width: '100%',
    height: 55,
    backgroundColor: '#000000',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  already: {
    fontFamily: 'LexendDeca_400Regular',
    width: '100%',
    height: 55,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 13,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 14,

    marginTop: 9,
  },
  forget: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 17,
    marginBottom: '80px',
  },
  clckforget: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 16,

    lineHeight: 18,
    color: '#1D1D1D',
  },
});
