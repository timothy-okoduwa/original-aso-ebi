import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {usePushNotifications} from './usePushNotification'
import registerNNPushToken, { registerIndieID } from 'native-notify';

export default function Index() {
  // Initialize Native Notify
  registerNNPushToken(28536, 'd6slDjhY9zuXZa6B5mRRLR');

  const {expoPushToken, notification} = usePushNotifications()
  const data = JSON.stringify(notification, undefined, 2)
  const [userId, setUserId] = useState(null);
  const [tokenUpdateStatus, setTokenUpdateStatus] = useState('');
  
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

  // Function to update user ID as FCM token
  const updateFCMToken = async (uid) => {
    if (!uid) {
      console.log("Missing userId");
      return;
    }
    
    try {
      console.log(`Updating FCM token for user ${uid}: ${uid}`);
      const response = await fetch(`https://oae-be.onrender.com/api/oae/auth/${uid}/update-fcm-token`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fcmToken: uid }),
      });
      
      if (response.ok) {
        console.log('FCM token updated successfully');
        setTokenUpdateStatus('Token updated successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to update FCM token:', errorText);
        setTokenUpdateStatus('Failed to update token: ' + errorText);
      }
    } catch (error) {
      console.error('Error updating FCM token:', error);
      setTokenUpdateStatus('Error: ' + error.message);
    }
  };

  useEffect(() => {
    // Fetch userId from AsyncStorage
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          setUserId(id);
          
          // Register the userId with Native Notify
          registerIndieID(id, 28536, 'd6slDjhY9zuXZa6B5mRRLR');
          console.log(`Registered IndieID: ${id}`);
          
          // Update the backend with userId as FCM token
          updateFCMToken(id);
          
          return id;
        }
      } catch (error) {
        console.error("Error fetching userId from AsyncStorage", error);
      }
      return null;
    };

    getUserId();
  }, []);
console.log(tokenUpdateStatus)
  useEffect(() => {
    if (!fontsLoaded || fontError) return;

    // Function to check for user token in AsyncStorage
    const checkUserToken = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          // If a token is found, navigate to main home page
          router.push("/onboarding");
        } else {
          // If no token, navigate to onboarding page
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error fetching token from AsyncStorage", error);
        router.push("/onboarding");
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

    // After 5 seconds, check for the user token
    const timer = setTimeout(() => {
      checkUserToken(); // Check token after 5 seconds
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
      <StatusBar style="dark" backgroundColor="#000" />
      <Text style={styles.small}>By Idera Oluwa</Text>
      {/* Uncomment for debugging */}
      {/* <Text style={styles.small}>User ID: {userId || 'Loading...'}</Text>
      <Text style={styles.small}>Status: {tokenUpdateStatus}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  textContainer: {
    flexDirection: "row",
  },
  text: {
    color: "white",
    fontSize: 64,
    fontWeight: "600",
    fontFamily: "LexendDeca_400Regular",
  },
  small: {
    color: "white",
    fontSize: 16,
    fontFamily: "LexendDeca_400Regular",
  },
});