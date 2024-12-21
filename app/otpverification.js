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
} from "react-native";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "../components/features/auth/authSlice";
import Toast from "react-native-toast-message";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Lora_500Medium } from "@expo-google-fonts/lora";
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
  const { userId } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const { status, error, successMessage } = useSelector((state) => state.auth);
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, 6000); // Hide toast after 3 seconds
  };

  useEffect(() => {
    // Cleanup function to hide toast when component unmounts
    return () => {
      setToast({ visible: false, message: "", type: "" });
    };
  }, []);

  const handleVerifyOtp = () => {
    if (otpValue.length !== 4) {
      showToast("Please enter a 4-digit OTP", "error");
      return;
    }

    setIsLoading(true);
    dispatch(verifyOtp({ otp: otpValue, userId }))
      .then((result) => {
        setIsLoading(false);
        if (result.meta.requestStatus === "fulfilled") {
          showToast("OTP verified successfully, proceed to login", "success");
          // Handle success (e.g., navigate to next screen)
          router.push("/login");
        } else {
          showToast(result.payload?.message || result.error.message, "error");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        showToast("An unexpected error occurred", "error");
        console.error("Error during OTP verification:", error);
      });
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
            <Text style={styles.enadp}>user ID: {userId}</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.greetings}>
              We have sent a 4 digit OTP to your{" "}
              <Text style={{ fontWeight: "bold" }}>Email Address</Text> , please
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
                  <Text style={{ color: "white" }}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </View>
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
});
