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
import AsyncStorage from '@react-native-async-storage/async-storage';
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

    // Function to check for user token in AsyncStorage
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // If a token is found, navigate to main home page
          router.push('/mainhome');
        } else {
          // If no token, navigate to onboarding page
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error fetching token from AsyncStorage', error);
        router.push('/onboarding');
      }
    };

    // Animation function
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

    // Start the letter animation
    animateLetters();

    // After 10 seconds, check for the user token
    const timer = setTimeout(() => {
      checkUserToken(); // Check token after 10 seconds
    }, 5000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [fontsLoaded, fontError, router]);

  if (!fontsLoaded || fontError) {
    return null; // Ensure fonts are loaded before rendering
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
        <TouchableOpacity style={styles.textContainer}>
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
