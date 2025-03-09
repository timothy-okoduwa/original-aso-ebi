import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import a from "../constants/image/check.png";
import { StatusBar } from "expo-status-bar";
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

export default function ResetLinkSent() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || "";
  
  // Initialize otp as a number (null instead of empty string)
  const [otp, setOtp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Resend timer state
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Set up countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const verifyOtp = async () => {
    // Check if otp is a valid 4-digit number
    if (!otp || otp < 1000 || otp > 9999) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://oae-be.onrender.com/api/oae/auth/confirm-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp, // This will now be a number
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // OTP verified successfully
        Alert.alert("Success", "OTP verified successfully");
        router.push({
          pathname: "/resetpassword",
          params: { email, token: data.token || "" },
        });
      } else {
        // OTP verification failed
        setError(data.message || "Failed to verify OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection and try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change - convert string to number
  const handleOtpChange = (text) => {
    // If input is empty, set to null
    if (text === '') {
      setOtp(null);
      return;
    }
    
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Convert to number and update state
    if (numericValue) {
      setOtp(parseInt(numericValue, 10));
    }
  };

  // Resend OTP function
  const resendOtp = async () => {
    if (countdown > 0 || !email) return;
    
    setResendLoading(true);
    setError("");
    
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
        Alert.alert("Success", "OTP has been resent to your email");
        // Start countdown timer
        setCountdown(30);
      } else {
        setError(responseData.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.");
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
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
        <View style={styles.createups}>
          <View style={styles.inputs}>
            <View style={styles.ccircle}>
              <Image style={styles.image} source={a} resizeMode="cover" />
            </View>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.reserr}>Reset Code Sent</Text>
            <Text style={styles.password}>
              A password reset code has been sent to {email ? email : "your email"}. Check your
              mailbox and type it here.
            </Text>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.labell}>Enter OTP Code</Text>
            <View style={{ marginTop: 16 }}>
              <TextInput
                style={styles.inputt}
                placeholder="Enter 4-digit code"
                keyboardType="number-pad"
                maxLength={4}
                value={otp !== null ? otp.toString() : ''}
                onChangeText={handleOtpChange}
                placeholderTextColor="#999"
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
          <View style={{ marginTop: 50, marginBottom: 30 }}>
            <TouchableOpacity
              style={[styles.create, isLoading && styles.createDisabled]}
              onPress={verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontFamily: "LexendDeca_400Regular" }}>
                  Verify OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.resendContainer}
            onPress={resendOtp}
            disabled={countdown > 0 || resendLoading}
          >
            {resendLoading ? (
              <ActivityIndicator size="small" color="#007F5F" />
            ) : (
              <Text style={styles.resendText}>
                Didn't receive the code?{" "}
                <Text 
                  style={[
                    styles.resendLink, 
                    countdown > 0 && styles.resendLinkDisabled
                  ]}
                >
                  {countdown > 0 
                    ? `Resend in ${countdown}s` 
                    : "Resend"}
                </Text>
              </Text>
            )}
          </TouchableOpacity>
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
    marginTop: 30,
  },
  testx: {
    marginLeft: 10,
  },
  reegister: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
    lineHeight: 24,
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
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
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
  createDisabled: {
    backgroundColor: "#666666",
  },
  error: {
    color: "red",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    marginTop: 9,
  },
  ccircle: {
    height: 200,
    width: 200,
    marginBottom: 20,
    overflow: "hidden",
  },
  reserr: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
    lineHeight: 24.8,
    color: "#000000",
    textAlign: "center",
  },
  password: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    marginTop: 17,
    textAlign: "center",
  },
  image: {
    width: "100%",
    flex: 1,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 20,
    height: 30,
    justifyContent: "center",
  },
  resendText: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    color: "#6B6B6B",
  },
  resendLink: {
    fontFamily: "KumbhSans_500Medium",
    color: "#007F5F",
  },
  resendLinkDisabled: {
    color: "#AAAAAA",
  },
});