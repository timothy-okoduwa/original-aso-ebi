import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { Image } from 'react-native'; // Import Image from 'react-native' instead of 'expo-image'
import a from '../constants/image/oo.png';
import { useFonts, Ledger_400Regular } from '@expo-google-fonts/ledger';
import { LexendDeca_400Regular } from '@expo-google-fonts/lexend-deca';
import { AntDesign } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function Onboarding() {
  const router = useRouter();
  // Capitalize the function name to follow convention
  const [fontsLoaded, fontError] = useFonts({
    Ledger_400Regular,
    LexendDeca_400Regular,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const gotocreataccount = () => {
    router.push('/createaccount');
  };
  const gotologin = () => {
    router.push('/login');
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.main}>
        <View style={styles.imageHolder}>
          <Image style={styles.image} source={a} resizeMode="cover" />
        </View>
        <View style={styles.okok}>
          <Text style={styles.welcome}>Welcome to Original</Text>
          <Text style={styles.welcome}>Aso Ebi</Text>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={styles.long}>
            Welcome to OAE – Where style meets elegance! Explore curated
            collections and the latest trendy fabrics.
          </Text>
        </View>
        <View style={{ marginTop: 18 }}>
          <View style={{ width: '100%' }}>
            <TouchableOpacity style={styles.create} onPress={gotocreataccount}>
              <Text style={{ color: 'white' }}>Create Account</Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%' }}>
            <TouchableOpacity style={styles.already} onPress={gotologin}>
              <Text>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.footer}>
            <Text style={styles.skip}>Skip</Text>
            <View style={styles.arrowIcon}>
              <AntDesign name="arrowright" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 
        
        
        
        </View> */}
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
  imageHolder: {
    height: 433,
    width: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  okok: {
    marginTop: 15,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontFamily: 'Ledger_400Regular',
    textAlign: 'center',
  },
  long: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Ledger_400Regular',
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
    borderColor: '#000000',
    color: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 13,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginTop: 18,
  },
  skip: {
    fontSize: 18,

    // marginLeft: 'auto',
    fontFamily: 'LexendDeca_400Regular',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});
