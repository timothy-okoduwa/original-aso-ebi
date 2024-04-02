import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import a from '../constants/image/phonev.png';
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
export default function passwordresetsuccessful() {
  const router = useRouter();
  const gotoreresetpassword = () => {
    router.push('/login');
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
        <View style={styles.createups}>
          <View style={styles.inputs}>
            <View style={styles.ccircle}>
              <Image style={styles.image} source={a} resizeMode="cover" />
            </View>
          </View>
          <View style={{ marginTop: '20px' }}>
            <Text style={styles.reserr}>Password Reset Successful</Text>
            <Text style={styles.password}>
              Your password has been reset successfully. Click to to login with
              your new password.
            </Text>
          </View>
          <View style={{ marginTop: 50, marginBottom: '30px' }}>
            <TouchableOpacity
              style={styles.create}
              onPress={gotoreresetpassword}
            >
              <Text style={{ color: 'white' }}>Done</Text>
            </TouchableOpacity>
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
    fontFamily: ' KumbhSans_500Medium',
    fontSize: 20,

    lineHeight: 24,
  },
  createups: {
    marginTop: 50,
  },
  enadp: {
    fontFamily: '  Lora_500Medium',
    fontSize: 20,

    lineHeight: 24,
    textAlign: 'left',
    color: '#1D1D1D',
  },
  greetings: {
    fontFamily: ' KumbhSans_400Regular',
    fontSize: 18,

    lineHeight: 24,
    textAlign: 'left',
    color: '#6B6B6B',
  },
  inputs: {
    marginTop: 30,
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  labell: {
    // marginBottom: ,
    fontFamily: ' LexendDeca_400Regular',
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
    fontFamily: ' KumbhSans_400Regular',
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
    fontFamily: ' KumbhSans_400Regular',
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
    fontFamily: '  KumbhSans_500Medium',
    fontSize: 16,

    lineHeight: 18,
    color: '#1D1D1D',
  },
  ccircle: {
    height: 200,
    width: 200,
    marginBottom: 20,
    overflow: 'hidden',
  },
  reserr: {
    fontFamily: '  KumbhSans_500Medium',
    fontSize: 20,

    lineHeight: 24.8,
    color: '#000000',
    textAlign: 'center',
  },
  password: {
    marginTop: '17px',
    fontFamily: ' KumbhSans_400Regular',
    fontSize: 16,

    marginTop: 17,

    textAlign: 'center',
  },
  image: {
    width: '100%',
    flex: 1,
  },
});
