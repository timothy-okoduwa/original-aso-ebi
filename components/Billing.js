import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React from 'react';

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
export default function Billing({ onNext }) {
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
    <View style={styles.mainn}>
      <Text style={styles.store}>Billing Address</Text>

      <View style={styles.inputs}>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.labell}>Address</Text>
          <View style={{ marginTop: 8 }}>
            <TextInput
              style={styles.inputt}
              placeholder="Address"
              keyboardType="default"
              placeholderTextColor="#999"
            />
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.labell}>Phone Number</Text>
          <View style={{ marginTop: 8 }}>
            <TextInput
              style={styles.inputt}
              placeholder="09074927137"
              keyboardType="phone-pad" // Use 'phone-pad' for phone number input
              placeholderTextColor="#999" // Change placeholder text color here
              maxLength={15} // Optional: Limit input length
            />
          </View>
        </View>
        <View
          style={{
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={styles.labell}>Postal Code</Text>
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={styles.inputt2}
                placeholder="Postal Code"
                keyboardType="default" // Use 'default' for phone number input
                placeholderTextColor="#999" // Change placeholder text color here
                maxLength={15} // Optional: Limit input length
              />
            </View>
          </View>
          <View>
            <Text style={styles.labell}>Zipcode</Text>
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={styles.inputt2}
                placeholder="Zipcode"
                keyboardType="default" // Use 'phone-pad' for phone number input
                placeholderTextColor="#999" // Change placeholder text color here
                maxLength={15} // Optional: Limit input length
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 60,
          }}
        >
          <View style={styles.fkie}>
            <Text style={styles.delivv}>Delivery Information</Text>
            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text style={styles.deliv2}>
                Items will be delivered to the above address. You would receive
                notification to track your delivery
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.flux}>
          <TouchableOpacity style={styles.create} onPress={onNext}>
            <Text style={styles.first}>proceed</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  delivv: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 16,
  },
  deliv2: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 14,
  },
  store: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 20,
  },
  mainn: {
    flex: 1,
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
  label: {
    marginLeft: 15,
    width: '80%',
    fontFamily: 'Lora_400Regular',
    fontSize: 14,

    lineHeight: 18,
    textAlign: 'left',
    color: '#1D1D1D',
  },
  inputt: {
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  inputt2: {
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    width: 160,
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
  fkie: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    width: '100%',
    padding: 20,
  },
  flux: {
    backgroundColor: 'white',
    marginTop: 50,
  },
  create: {
    fontFamily: 'KumbhSans_500Medium',
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
  first: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'KumbhSans_500Medium',
  },
});
