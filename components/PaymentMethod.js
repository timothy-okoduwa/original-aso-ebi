import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useRef } from 'react';

import {
  useFonts,
  LexendDeca_400Regular,
} from '@expo-google-fonts/lexend-deca';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
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

export default function PaymentMethod({ onNext }) {
  const paystackWebViewRef = useRef(paystackProps.PayStackRef);
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
    <View>
      <Paystack
        paystackKey="pk_live_dc0a46a8affdd06e7d7a9ce3bfd5c842c71d0511"
        billingEmail="timothyokoduwa7@gmail.com"
        billingMobile="09045339820"
        billingName="timothy okoduwa"
        currency="NGN"
        amount={25000}
        paymentChannels={['card', 'bank_transfer']} // Add 'bank_transfer' to include bank transfers
        onCancel={(e) => {
          console.log(e);
        }}
        onSuccess={(res) => {
          console.log(res);
        }}
        ref={paystackWebViewRef}
      />
      <View style={styles.mainn}>
        <Text style={styles.store}>Select payment method</Text>
      </View>

      <View style={styles.pushh}>
        <TouchableOpacity
          style={styles.pettt}
          onPress={() => paystackWebViewRef.current.startTransaction()}
        >
          <View>
            <Text style={styles.plat}>Pay with Card or Bank transfer</Text>
            <View style={styles.dealss}>
              <View>
                <FontAwesome name="cc-visa" size={26} color="#0E4595" />
              </View>
              <View style={styles.mcas}>
                <FontAwesome name="cc-mastercard" size={26} color="#F79E1B" />
              </View>
            </View>
          </View>

          <Text>
            <AntDesign name="right" size={24} color="black" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pettt}>
          <View>
            <Text style={styles.plat}>Pay on Delivery</Text>
            <View style={styles.dealss}>
              <Text style={styles.pori}>
                Pay with cash when your order arives{' '}
              </Text>
            </View>
          </View>

          <Text>
            <AntDesign name="right" size={24} color="black" />
          </Text>
        </TouchableOpacity>
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
  pushh: {
    marginTop: 40,
  },
  pettt: {
    width: '100%',
    padding: 17,
    borderRadius: 16,
    borderColor: '#E9E9E9',
    borderWidth: 1,
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  plat: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'KumbhSans_500Medium',
  },
  dealss: {
    flexDirection: 'row',
    marginTop: 10,
  },
  mcas: {
    marginLeft: 10,
  },
  pori: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 15,
  },
});
