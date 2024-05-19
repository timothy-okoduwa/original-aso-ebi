// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableOpacity,
// } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import {
//   LexendDeca_400Regular,
//   useFonts,
// } from '@expo-google-fonts/lexend-deca';
// import { Link, useRouter } from 'expo-router';

// export default function Index() {
//   const [fontsLoaded, fontError] = useFonts({
//     LexendDeca_400Regular,
//   });

//   const router = useRouter();

//   const [animatedValue] = useState(new Animated.Value(0));
//   useEffect(() => {
//     if (!fontsLoaded || fontError) return;

//     const animate = () => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(animatedValue, {
//             toValue: 1,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//           Animated.timing(animatedValue, {
//             toValue: 0,
//             duration: 1000,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     };

//     animate();

//     const timeout = setTimeout(() => {
//       router.push('/onboarding');
//     }, 3000); // Navigate after 3 seconds

//     return () => {
//       clearTimeout(timeout);
//       animatedValue.stopAnimation();
//     };
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded || fontError) {
//     return null;
//   }
//   const scale = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [1, 1.5], // Scale up, then scale down
//   });
//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.animatedView, { transform: [{ scale }] }]}>
//         <Link href="/onboarding">
//           <Text style={styles.texts}>OAE</Text>
//         </Link>
//       </Animated.View>
//       <StatusBar style="light" backgroundColor="#000" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'black',
//   },
//   texts: {
//     flexDirection: 'row',
//     color: 'white',
//     fontSize: 64,
//     fontWeight: '600',
//     fontFamily: 'LexendDeca_400Regular',
//   },
//   letter: {
//     color: 'white',
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import {
  useFonts,
  LexendDeca_400Regular,
} from '@expo-google-fonts/lexend-deca';

export default function Index() {
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
  });

  const router = useRouter();
  const [slideAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    const animateSlide = () => {
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 500, // Adjust duration as needed
        useNativeDriver: true,
      }).start();
    };

    animateSlide();

    return () => {
      slideAnimation.setValue(0);
    };
  }, [fontsLoaded, fontError]);

  const handleNavigation = () => {
    // Perform custom slide animation here
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 500, // Adjust duration as needed
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding');
    });
  };

  if (!fontsLoaded || fontError) {
    return null;
  }

  const slidePosition = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1000], // Adjust distance as needed
  });

  return (
    <View style={styles.container}>
      <Link href="/onboarding">
        <Text style={styles.texts}>OAE</Text>
      </Link>

      <StatusBar style="light" backgroundColor="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  texts: {
    flexDirection: 'row',
    color: 'white',
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'LexendDeca_400Regular',
  },
});
