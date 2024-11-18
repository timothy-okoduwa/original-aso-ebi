/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";

import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../components/features/auth/authSlice";
import Toast from "react-native-toast-message";
import { useLoading } from "./LoadingContext";
// import { Feather } from '@expo/vector-icons';
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

export default function login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [isInputFocused, setIsInputFocused] = useState(false);

  // State variables to store input values and corresponding error messages
  const { showLoading, hideLoading } = useLoading();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const successMessage = useSelector((state) => state.auth.successMessage);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const gotocreateaccount = () => {
    router.push("/createaccount");
  };
  const gotoforgetpassword = () => {
    router.push("/forgetpassword");
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  // Validation functions

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
      return false;
    }

    const hasAtSymbol = email.includes("@");
    const hasDotCom = email.endsWith(".com");

    if (!hasAtSymbol) {
      setEmailError('Email is missing "@" symbol');
      return false;
    }

    if (!hasDotCom) {
      setEmailError('Email is missing ".com"');
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

  const validatePassword = () => {
    if (password.trim() === "") {
      setPasswordError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);

    if (!containsLetters || !containsNumbers) {
      setPasswordError("Password must contain both letters and numbers");
      return false;
    }

    setPasswordError("");
    return true;
  };
  const showToast = (message, type) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" });
    }, 3000); // Hide toast after 3 seconds
  };

  useEffect(() => {
    return () => {
      setToast({ visible: false, message: "", type: "" });
    };
  }, []);

  // Handle submit button press
  const handleLogin = async () => {
    setLoading(true);
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      setLoading(false); // Ensure loading is set to false if there is an error
      return; // Exit the function early
    }
    setLoading(true); // Only set loading to true if all validations pass
    showLoading(); // Show loading indicator before starting async operation

    if (isEmailValid && isPasswordValid) {
      const response = await dispatch(loginUser({ email, password }));
      console.log(response);
    } else {
      setLoading(false);
      hideLoading();
    }
  };

  useEffect(() => {
    if (authStatus === "succeeded") {
      showToast(successMessage || "Registration successful!", "success");
      setLoading(false);
      hideLoading();
      router.push("/mainhome");
    } else if (authStatus === "failed") {
      showToast(authError || "Registration failed. Please try again.", "error");
      setLoading(false);
      hideLoading();
    }
  }, [authStatus, successMessage, authError]);

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

  useEffect(() => {
    // If fonts are not loaded, show loading indicator
    if (!fontsLoaded) {
      showLoading(); // Show loading indicator until fonts are loaded
    } else {
      hideLoading(); // Hide loading indicator after fonts are loaded
      setLoading(false); // Set loading to false after fonts are loaded
    }
  }, [fontsLoaded]);
  const isDisabled = loading || !email || !password;
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // After 2 seconds stop refreshing
      setRefreshing(false);
    }, 2000);
  };
  return (
    <View>
      <View style={styles.toasr}>
        <CustomToast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F11515", "#000000", "#0000ff"]}
            tintColor="red"
            title="Pull to refresh..."
            titleColor="#00ff00"
          />
        }
      >
        <StatusBar style="dark" />
        <View style={styles.main}>
          <View style={styles.flex}>
            <Link href="/onboarding">
              <View>
                <AntDesign name="arrowleft" size={24} color="black" />
              </View>
              <View style={styles.testx}>
                <Text style={styles.reegister}>Welcome Back</Text>
              </View>
            </Link>
          </View>
          <View style={styles.createups}>
            <View>
              <Text style={styles.enadp}>Email and Password</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.greetings}>
                Welcome to Original Aso-Ebi! Please provide your email address
                and password to log into your account.
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
                    keyboardType="email-address" // Change this to 'password' or 'default' for different types
                    placeholderTextColor="#999" // Change placeholder text color here
                  />
                </View>
                <Text style={styles.error}>{emailError}</Text>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.labell}>Password</Text>
                <View style={{ marginTop: 16 }}>
                  <View
                    style={[
                      styles.scares,
                      {
                        borderColor: isInputFocused ? "black" : "gray",
                        borderWidth: isInputFocused ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inpu2}
                        placeholder="*********"
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                        underlineColorAndroid="transparent"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Feather
                          name={showPassword ? "eye" : "eye-off"}
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.error}>{passwordError}</Text>
              </View>
              <View style={styles.forget}>
                <TouchableOpacity
                  style={styles.clckforget}
                  onPress={gotoforgetpassword}
                >
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 30, marginBottom: 30 }}>
                <TouchableOpacity
                  style={[styles.create, { opacity: isDisabled ? 0.5 : 1 }]}
                  onPress={handleLogin}
                  disabled={isDisabled}
                >
                  {loading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={{ color: "white" }}>Log in</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.already}
                  onPress={gotocreateaccount}
                >
                  <Text>Don’t have an account? Sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  toasr: {
    position: "absolute", // Make sure the toast is positioned absolutely
    top: 0, // Adjust the top position if needed
    left: 0, // Align with the left edge
    right: 0, // Align with the right edge
    zIndex: 1000, // Bring the toast to the front

    padding: 10, // Add padding for a better appearance
    borderRadius: 10, // Optional: add border-radius for rounded corners
  },
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
  },
  labell: {
    // marginBottom: ,
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
  scares: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'red',
    width: "100%",
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,

    paddingRight: 20,
  },
  inputContainer: {
    flex: 1, // Make the container flex to fill the available space
  },
  inpu2: {
    width: "fit-content",
    borderColor: "transparent", // Set border color to transparent
    borderWidth: 0, // Set border width to 0
    outlineColor: "transparent", // Set outline color to transparent
    outlineWidth: 0, // Set outline width to 0

    height: 50,
    width: "auto",
    paddingLeft: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "blue", // Adjust color as needed
  },
  label: {
    marginLeft: 15,
    width: "80%",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,

    lineHeight: 18,
    textAlign: "left",
    color: "#1D1D1D",
  },
  others: {
    fontFamily: "KumbhSans_500Medium",

    color: "#007F5F",
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
  already: {
    fontFamily: "LexendDeca_400Regular",
    width: "100%",
    height: 55,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
    color: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 13,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,

    marginTop: 9,
  },
  forget: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 2,
    marginBottom: 40,
  },
  clckforget: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 16,

    lineHeight: 18,
    color: "#1D1D1D",
  },
  toast: {
    position: "absolute",
    top: 60, // Positioned at the top
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    zIndex: 9999, // Ensure it's above other elements
  },
  successToast: {
    backgroundColor: "rgba(0, 128, 0, 0.9)",
  },
  errorToast: {
    backgroundColor: "rgba(255, 0, 0, 0.9)",
  },
  toastText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
