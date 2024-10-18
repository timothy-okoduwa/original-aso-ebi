import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React,{useEffect} from 'react';
import { Image } from 'react-native';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import a from '../constants/image/sen2.png';
export default function OnGoingOrders() {
      const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return (
    <View>
            <View style={styles.holderr}>
          <View>
            <View style={styles.imageHolder}>
              <Image
                style={styles.image}
                source={ a}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.prices}>
            <View>
              <View>
                <Text style={styles.namez}>Brown Striped Fabric</Text>
              </View>
              <View>
                <Text style={styles.amont}>
                  ₦
                 20,000
                </Text>
              </View>
              <View>
                <Text style={styles.qty}>Qty: 5 yards</Text>
              </View>
            </View>
            <View style={styles.pills}>
                <Text>Confirmed</Text>
            </View>
          </View>
         
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  pop: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  
  },
  total: {
    fontSize: 25,
    fontFamily: 'KumbhSans_500Medium',
    color: '#000000',
  },
  added: {
    width: '100%',
    height: 55,
    backgroundColor: '#ffffff',
    color: '#767676',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,

    borderWidth: 1, // Add border width
    borderColor: '#767676', // Add border color
  },
  first: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'KumbhSans_500Medium',
  },
  sec: {
    color: '#767676',
    fontSize: 16,
    fontFamily: 'KumbhSans_500Medium',
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
  flux: {
    backgroundColor: 'white',
    marginTop: 50,
  },

  summary: {
    marginTop: 30,
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 20,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
  },
  holderr: {

    // backgroundColor: 'green',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  imageHolder: {
    height: 100, // Adjust card height as needed
    width: 100, // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 3.12,
    overflow: 'hidden',
    // backgroundColor: 'red',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  prices: {
    marginLeft: 20,
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  namez: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
  },
  amont: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
    marginTop: 10,
  },
  qty: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
    marginTop: 10,
  },
  counter: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  incone: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
  },
  incbut: {
    width: 29,
    height: 26,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add border width
    borderColor: '#DCDCDC', // Add border color
  },
  gaddle: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#D2D2D233',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add border width
    borderColor: '#DCDCDC', // Add border color
  },
  mount: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 13,
    color: '#000000',
  },
  delete: {
    // marginLeft: 80,
    flex: 1,

    alignItems: 'flex-end',
  },
  cartt: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 146,
    height: 146,
    backgroundColor: '#F9F9F9',
    borderRadius: 73,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    marginTop: 20,
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
    color: '#000000',
  },
  once: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    marginTop: 10,
    width: 250,
    textAlign: 'center',
  },
});
