import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  LexendDeca_400Regular,
  useFonts,
} from '@expo-google-fonts/lexend-deca';
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
  });

  const router = useRouter();

  const [animatedValues] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    const animate = () => {
      Animated.sequence([
        Animated.timing(animatedValues[0], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[1], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[2], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[0], {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[1], {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[2], {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Adjust the delay as needed
        animate(); // Restart the animation sequence
      });
    };

    animate();

    return () => {
      animatedValues.forEach((value) => value.stopAnimation());
    };
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Link href="/onboarding">
        <Text style={styles.texts}>OAE</Text>
      </Link>
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
  letter: {
    color: 'white',
  },
});
