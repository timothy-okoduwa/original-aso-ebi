import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {
  useFonts,
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
export default function HeadAndNotification({userName}) {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const goToNotifiation = () => {
    router.push('/notification');
  };
 
  return (
    <View style={styles.mainhold}>
      <View style={styles.flexes}>
        <View>
          <Text style={styles.oae}>OAE</Text>
          
                      <View >
                        <Text> Welcome, {userName ? userName : "Guest"}</Text>
                      </View>
                   
        </View>
        <View>
          {/* <Text>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </Text> */}
          <TouchableOpacity onPress={goToNotifiation}>
            <Text>
              <MaterialCommunityIcons
                name="bell-badge-outline"
                size={30}
                color="black"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainhold: {
    marginTop: 0,
   
  },
  flexes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oae: {
    fontFamily: 'KumbhSans_600SemiBold',
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'left',
    color: '#000000',
    marginBottom:10
  },
});
