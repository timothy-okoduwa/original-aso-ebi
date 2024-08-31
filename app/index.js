import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CartProvider } from './CartContext';
import {
  useFonts,
  LexendDeca_400Regular,
} from '@expo-google-fonts/lexend-deca';

export default function Index() {
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
  });

  const router = useRouter();

  // Animated values for each letter
  const [animations] = useState({
    O: {
      scale: new Animated.Value(0),
      translateY: new Animated.Value(20),
    },
    A: {
      scale: new Animated.Value(0),
      translateY: new Animated.Value(20),
    },
    E: {
      scale: new Animated.Value(0),
      translateY: new Animated.Value(20),
    },
  });

  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    const createAnimation = (scale, translateY) => {
      return Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 500, // Adjust duration as needed
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500, // Adjust duration as needed
          useNativeDriver: true,
        }),
      ]);
    };

    const animateLetters = () => {
      Animated.loop(
        Animated.stagger(300, [
          createAnimation(animations.O.scale, animations.O.translateY),
          createAnimation(animations.A.scale, animations.A.translateY),
          createAnimation(animations.E.scale, animations.E.translateY),
        ])
      ).start();
    };

    animateLetters();

    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 10000); // Navigate after 10 seconds

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, [fontsLoaded, fontError, router]);

  const handleNavigation = () => {
    router.push('/onboarding');
  };

  if (!fontsLoaded || fontError) {
    return null;
  }

  const animatedStyles = {
    O: {
      transform: [
        { scale: animations.O.scale },
        { translateY: animations.O.translateY },
      ],
    },
    A: {
      transform: [
        { scale: animations.A.scale },
        { translateY: animations.A.translateY },
      ],
    },
    E: {
      transform: [
        { scale: animations.E.scale },
        { translateY: animations.E.translateY },
      ],
    },
  };

  return (
    <CartProvider>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={handleNavigation}
          style={styles.textContainer}
        >
          <Animated.Text style={[styles.text, animatedStyles.O]}>
            O
          </Animated.Text>
          <Animated.Text style={[styles.text, animatedStyles.A]}>
            A
          </Animated.Text>
          <Animated.Text style={[styles.text, animatedStyles.E]}>
            E
          </Animated.Text>
        </TouchableOpacity>
        <StatusBar style="light" backgroundColor="#000" />
        <Text style={styles.small}>By Idera Oluwa</Text>
      </View>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  textContainer: {
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 64,
    fontWeight: '600',
    fontFamily: 'LexendDeca_400Regular',
  },
  small: {
    color: 'white',
    fontSize: 16,

    fontFamily: 'LexendDeca_400Regular',
  },
});

// import React, { useEffect } from 'react';
// import { View, StyleSheet, Animated } from 'react-native';
// import { Svg, Path } from 'react-native-svg';
// import { StatusBar } from 'expo-status-bar';
// import { useRouter } from 'expo-router';
// import {
//   useFonts,
//   LexendDeca_400Regular,
// } from '@expo-google-fonts/lexend-deca';

// export default function Index() {
//   const [fontsLoaded, fontError] = useFonts({
//     LexendDeca_400Regular,
//   });

//   const router = useRouter();

//   const animatedValues = {
//     O: new Animated.Value(0),
//     A: new Animated.Value(0),
//     E: new Animated.Value(0),
//   };

//   useEffect(() => {
//     if (!fontsLoaded || fontError) return;

//     const animateLetters = () => {
//       Animated.stagger(500, [
//         Animated.timing(animatedValues.O, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(animatedValues.A, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(animatedValues.E, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     };

//     animateLetters();

//     const timer = setTimeout(() => {
//       router.push('/onboarding');
//     }, 10000);

//     return () => clearTimeout(timer);
//   }, [fontsLoaded, fontError, router]);

//   if (!fontsLoaded || fontError) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       <Svg height="150" width="150" viewBox="0 0 100 100">
//         <Path
//           d="M 50,10 A 40,40 0 1,1 49,10"
//           stroke="white"
//           strokeWidth="2"
//           fill="none"
//           strokeDasharray="158"
//           strokeDashoffset={animatedValues.O.interpolate({
//             inputRange: [0, 1],
//             outputRange: [158, 0],
//           })}
//         />
//       </Svg>
//       <Svg height="150" width="150" viewBox="0 0 100 100">
//         <Path
//           d="M 50,10 L 20,90 L 80,90 Z"
//           stroke="white"
//           strokeWidth="2"
//           fill="none"
//           strokeDasharray="180"
//           strokeDashoffset={animatedValues.A.interpolate({
//             inputRange: [0, 1],
//             outputRange: [180, 0],
//           })}
//         />
//       </Svg>
//       <Svg height="150" width="150" viewBox="0 0 100 100">
//         <Path
//           d="M 20,10 L 80,10 L 20,50 L 80,50 L 20,90 L 80,90"
//           stroke="white"
//           strokeWidth="2"
//           fill="none"
//           strokeDasharray="128"
//           strokeDashoffset={animatedValues.E.interpolate({
//             inputRange: [0, 1],
//             outputRange: [128, 0],
//           })}
//         />
//       </Svg>
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
//     flexDirection: 'row',
//   },
// });
