import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {
  KumbhSans_100Thin,
  KumbhSans_200ExtraLight,
  KumbhSans_300Light,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
  KumbhSans_900Black,
} from "@expo-google-fonts/kumbh-sans";
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
  Lora_400Regular_Italic,
  Lora_500Medium_Italic,
  Lora_600SemiBold_Italic,
  Lora_700Bold_Italic,
} from "@expo-google-fonts/lora";

export default function forgetpassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const back = () => {
    router.back();
  };

  // Validate email format
  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address");
      return false;
    }

    setEmailError("");
    return true;
  };

  // Handle submit button press
  const handleForgetPassword = async () => {
    // First validate the email
    const isEmailValid = validateEmail();
    
    if (!isEmailValid) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(
        "https://oae-be.onrender.com/api/oae/auth/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        console.log("Password reset OTP sent successfully");
        
        // Store the email to be used in the next screens
        await AsyncStorage.setItem("resetEmail", email);
        
        // Navigate to OTP verification screen
        router.push("/resetlinksent");
      } else {
        console.error(
          "Error sending reset OTP:",
          responseData.message || "Failed to send reset OTP"
        );
        Alert.alert(
          "Error", 
          responseData.message || "Failed to send reset OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert(
        "Network Error", 
        "Unable to connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
    Lora_500Medium_Italic,
    Lora_600SemiBold_Italic,
    Lora_700Bold_Italic,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        <TouchableOpacity style={styles.flex} onPress={back}>
          <View>
            <AntDesign name="arrowleft" size={24} color="black" />
          </View>
          <View style={styles.testx}>
            <Text style={styles.reegister}>Forget Password</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Enter your email</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.greetings}>
              Enter your email address to receive a verification code for resetting
              your password.
            </Text>
          </View>
          <View style={styles.inputs}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labell}>Email</Text>
              <View style={{ marginTop: 16 }}>
                <TextInput
                  style={styles.inputt}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder="youremail@here.com"
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                  autoCapitalize="none"
                />
              </View>
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Text style={styles.error}>{emailError}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 30, marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.create, isLoading && styles.disabledButton]}
                onPress={handleForgetPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontFamily: "LexendDeca_400Regular" }}>Send Reset Code</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
  flex: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 80, // Fixed from string to number
  },
  testx: {
    marginLeft: 10,
  },
  reegister: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 25,
  },
  createups: {
    marginTop: 50,
  },
  enadp: {
    fontFamily: "Lora_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "left",
    color: "#1D1D1D",
  },
  greetings: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "left",
    color: "#6B6B6B",
  },
  inputs: {
    marginTop: 30,
  },
  labell: {
    fontFamily: "LexendDeca_400Regular",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "left",
    color: "#6B6B6B",
  },
  inputt: {
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  create: {
    fontFamily: "LexendDeca_400Regular",
    width: "100%",
    height: 55,
    backgroundColor: "#000000",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#666666",
  },
  error: {
    color: "red",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    marginTop: 9,
  },
});