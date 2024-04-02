import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';

export default function ButtomNav() {
  const pathname = usePathname();
  //   console.log(pathname);

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <View style={styles.main}>
      <View style={styles.flexes}>
        <View>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View>
              <AntDesign
                name="home"
                size={24}
                color={pathname === '/mainhome' ? '#000000' : '#b3b3b3'}
              />
            </View>
            <Text
              style={{
                color: pathname === '/mainhome' ? '#000000' : '#b3b3b3',
              }}
            >
              Home
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View>
              <Feather
                name="shopping-bag"
                size={24}
                color={pathname === '/shop' ? '#000000' : '#b3b3b3'}
              />
            </View>
            <Text
              style={{ color: pathname === '/shop' ? '#000000' : '#b3b3b3' }}
            >
              Shop
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View>
              <Ionicons
                name="cart-outline"
                size={24}
                color={pathname === '/cart' ? '#000000' : '#b3b3b3'}
              />
            </View>
            <Text
              style={{ color: pathname === '/cart' ? '#000000' : '#b3b3b3' }}
            >
              Cart
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <View>
              <Ionicons
                name="settings-outline"
                size={24}
                color={pathname === '/settings' ? '#000000' : '#b3b3b3'}
              />
            </View>
            <Text
              style={{
                color: pathname === '/settings' ? '#000000' : '#b3b3b3',
              }}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // padding: 15,
    backgroundColor: 'white',
    height: 66,
  },
  flexes: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-around',
  },
  labels: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    color: '#000000',
    marginTop: 15,
  },
});
