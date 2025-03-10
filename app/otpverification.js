/** @format */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Lora_500Medium } from "@expo-google-fonts/lora";
import { AuthManager } from "./AuthManager";

const CustomToast = ({ visible, message, type }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        { opacity: fadeAnim },
        type === "success" ? styles.successToast : styles.errorToast,
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const OtpInput = ({ onOtpChange }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onOtpChange(newOtp.join(""));

    if (text !== "" && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {[0, 1, 2, 3].map((index) => (
        <TextInput
          key={index}
          style={styles.otpInput}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          ref={(ref) => (inputRefs.current[index] = ref)}
        />
      ))}
    </View>
  );
};

export default function OtpVerification() {
  const params = useLocalSearchParams();
  const { userId, email } = params;
  const userIdentifier = email || userId;
  const router = useRouter();
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [countdown, setCountdown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  
  // Set up countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, 6000); // Hide toast after 6 seconds
  };

  useEffect(() => {
    // Cleanup function to hide toast when component unmounts
    return () => {
      setToast({ visible: false, message: "", type: "" });
    };
  }, []);

  // Function to store auth data in AsyncStorage
// In OtpVerification.js - Update your handleVerifyOtpFunction
const handleVerifyOtpFunction = async () => {
  if (otpValue.length !== 4) {
    showToast("Please enter a 4-digit OTP", "error");
    return;
  }

  setIsLoading(true);
  
  try {
    console.log("Sending OTP verification request for:", userIdentifier);
    
    const response = await fetch(
      "https://oae-be.onrender.com/api/oae/auth/confirm-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userIdentifier,
          otp: parseInt(otpValue, 10),
        }),
      }
    );

    const data = await response.json();
    console.log("OTP verification response:", data);

    if (response.ok) {
      showToast("OTP verified successfully", "success");
      
      setTimeout(() => {
        // Use AuthManager to handle OTP completion
        AuthManager.completeOtpVerification();
      }, 1000);
    } else {
      showToast(data.message || "Failed to verify OTP. Please try again.", "error");
    }
  } catch (error) {
    showToast("An unexpected error occurred", "error");
    console.error("Error during OTP verification:", error);
  } finally {
    setIsLoading(false);
  }
};
  const handleVerifyOtp = () => {
    handleVerifyOtpFunction();
  };
// Add this near the top of your OTP verification component

  // Resend OTP function
  const resendOtp = async () => {
    if (countdown > 0 || !userIdentifier) return;
    
    setResendLoading(true);
    
    try {
      const response = await fetch(
        "https://oae-be.onrender.com/api/oae/auth/forget-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userIdentifier }),
        }
      );

      const responseData = await response.json();
      
      if (response.ok) {
        showToast("OTP has been resent to your email", "success");
        // Start countdown timer
        setCountdown(30);
      } else {
        showToast(responseData.message || "Failed to resend OTP", "error");
      }
    } catch (error) {
      showToast("Network error. Please check your connection", "error");
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    Lora_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        <View style={styles.flex}>
          <Link href="/onboarding">
            <View style={styles.headerContainer}>
              <AntDesign name="arrowleft" size={24} color="black" />
              <View style={styles.testx}>
                <Text style={styles.register}>Verification</Text>
              </View>
            </View>
          </Link>
        </View>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Verify your Email Address</Text>
            <Text style={styles.enadp}>user ID: {userIdentifier}</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.greetings}>
              We have sent a 4 digit OTP to your{" "}
              <Text style={{ fontWeight: "bold" }}>Email Address</Text>, please
              provide it in the boxes below.
            </Text>
          </View>
          <View style={styles.inputs}>
            <OtpInput onOtpChange={setOtpValue} />
            <View style={{ marginTop: 30, marginBottom: 30 }}>
              <TouchableOpacity
                style={styles.create}
                onPress={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontFamily: "LexendDeca_400Regular" }}>Verify OTP</Text>
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
      </View>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  testx: {
    marginLeft: 10,
  },
  register: {
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
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
  },
  create: {
    fontFamily: "LexendDeca_400Regular",
    width: "100%",
    height: 55,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  toast: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  successToast: {
    backgroundColor: "rgba(0, 128, 0, 0.7)",
  },
  errorToast: {
    backgroundColor: "rgba(255, 0, 0, 0.7)",
  },
  toastText: {
    color: "white",
    fontSize: 16,
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