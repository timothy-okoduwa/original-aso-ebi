import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import React,{useEffect} from 'react'
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
import OnGoingOrders from './OnGoingOrders';
export default function Orders() {
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

  useEffect(() => {
    // If fonts are not loaded, show loading indicator
    if (!fontsLoaded) {
    
    } else {

    }
  }, [fontsLoaded]);
  return (
    <View style={styles.main}>
      <View style={styles.slidehold}>
<View style={styles.middleslide}>
    <TouchableOpacity style={styles.left}>
        <Text style={styles.texts}>Ongoing</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.left}>
        <Text style={styles.texts}>Completed</Text>
    </TouchableOpacity>
</View>
      </View>

      <View style={styles.bambi}>
        <OnGoingOrders/>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({

  main: {
    padding: 15,
    flex: 1,
  },
  slidehold:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
  height:60,
  },
middleslide:{
    backgroundColor:'#F9F9F9',
    width:'80%',
   height:'100%',
   padding:10,
   flexDirection:'row',
   justifyContent:'space-between',
   borderRadius:12,
},
left:{
width:'48%',
height:'100%',
backgroundColor:'#FFFFFF',
borderRadius:10,

justifyContent:'center',
alignContent:'center'
},
texts:{
textAlign:'center',
fontSize: 18,
color:'#000000',
    fontFamily: 'KumbhSans_400Regular',
},
bambi:{
    marginTop:50
}
});