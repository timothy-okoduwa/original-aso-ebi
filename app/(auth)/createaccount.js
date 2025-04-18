/** @format */

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
import React, { useState, useEffect, useRef } from "react";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
// import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../components/features/auth/authSlice";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { useLoading } from "../contexts/LoadingContext";
import { registerIndieID } from 'native-notify';

// ;

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

export default function createaccount() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const successMessage = useSelector((state) => state.auth.successMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputFocused2, setIsInputFocused2] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null); // New state for storing the user's ID
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const role = 1;
  // State variables to store input values and corresponding error messages

  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [checkError, setCheckError] = useState("");
  const nativeNotifyAppId = 28536;
  const nativeNotifyAppToken = 'd6slDjhY9zuXZa6B5mRRLR';
  const handlePhoneChange = (text) => {
    let formattedPhone = text;

    // Remove the leading zero
    if (formattedPhone.startsWith("0")) {
      formattedPhone = formattedPhone.substring(1);
    }

    // Remove the +234 prefix
    if (formattedPhone.startsWith("234")) {
      formattedPhone = formattedPhone.substring(3);
    } else if (formattedPhone.startsWith("+234")) {
      formattedPhone = formattedPhone.substring(4);
    }

    setPhone(formattedPhone);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };
  const handleFocus2 = () => {
    setIsInputFocused2(true);
  };

  const handleBlur2 = () => {
    setIsInputFocused2(false);
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  // Validation functions
  const checkesit = () => {
    if (!isChecked) {
      setCheckError(
        "Please agree to the Terms and Conditions and Privacy Policy"
      );
      return false;
    }
    setCheckError("");
    return true;
  };
  const validatename = () => {
    if (name.trim() === "") {
      setnameError("Full name is required");
      return false;
    }
    setnameError("");
    return true;
  };
  const validatePhone = () => {
    if (phone.trim() === "") {
      setPhoneError("Phone number is required");
      return false;
    }
    setnameError("");
    return true;
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setEmailError("Email is required");
      return false;
    }

    const hasAtSymbol = email.includes("@");
    

    if (!hasAtSymbol) {
      setEmailError('Email is missing "@" symbol');
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

  const validateConfirmPassword = () => {
    if (confirmPassword.trim() === "") {
      setConfirmPasswordError("confirm password is required");
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
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

  // Register user with Native Notify
  const registerUserWithNativeNotify = (userId) => {
    try {
      registerIndieID(userId, nativeNotifyAppId, nativeNotifyAppToken);
      console.log(`Registered user with Native Notify: ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to register with Native Notify:', error);
      return false;
    }
  };

  // Function to update FCM token on the backend
const updateFCMToken = async (userId) => {
  if (!userId) {
    console.log("Missing userId for FCM token update");
    return;
  }
  
  try {
    console.log(`Updating FCM token for user ${userId}: ${userId}`);
    const response = await fetch(`https://oae-be.onrender.com/api/oae/auth/${userId}/update-fcm-token`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcmToken: userId }),
    });
    
    if (response.ok) {
      console.log('FCM token updated successfully');
    } else {
      const errorText = await response.text();
      console.error('Failed to update FCM token:', errorText);
    }
  } catch (error) {
    console.error('Error updating FCM token:', error);
  }
};

// Function to handle both registration with Native Notify and updating FCM token
const setupNotifications = async (userId) => {
  try {
    // First register with Native Notify
    registerUserWithNativeNotify(userId);
    
    // Then update FCM token on the backend
    await updateFCMToken(userId);
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};


  // Handle submit button press
  const handleCreateAccount = async () => {
    // Run all validations
    const isNameValid = validatename();
    const isPhoneValidated = validatePhone();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const eww = checkesit();

    // If any validation fails, return early and do not proceed further
    if (
      !isNameValid ||
      !isPhoneValidated ||
      !isEmailValid ||
      !eww ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      setLoading(false); // Ensure loading is set to false if there is an error
      return; // Exit the function early
    }

    setLoading(true); // Only set loading to true if all validations pass
    showLoading(); // Show loading indicator before starting async operation

    try {
      const response = await dispatch(
        registerUser({ name, email, phone, password, role: 1 })
      );

      if (response.meta.requestStatus === "fulfilled") {
        const newUserId = response.payload.data._id;
        setUserId(newUserId);
             // Set up notifications with the new user ID
  await setupNotifications(newUserId);

        console.log(response);
        showToast("Registration successful!", "success");
        router.push({
          pathname: "/otpverification",
          params: { userId: newUserId,email:email },
        });
      } else {
        showToast(response.error.message || "Registration failed", "error");
        console.log(response.error.message || "Registration failed", "error");
      }
    } catch (error) {
      showToast("An unexpected error occurred", "error");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  console.log(userId);
  // Use useEffect to handle side effects based on Redux state
  useEffect(() => {
    if (authStatus === "succeeded") {
      showToast(successMessage || "Registration successful!", "success");
    } else if (authStatus === "failed") {
      showToast(authError || "Registration failed. Please try again.", "error");
    }
  }, [authStatus, successMessage, authError]);

  const [fontsLoaded] = useFonts({
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
    // Simulate data loading
    showLoading();
    const timeout = setTimeout(() => {
      hideLoading();
    }, 1000); // Adjust the timeout to simulate data loading time

    return () => clearTimeout(timeout);
  }, []);
  const isDisabled =
    loading || !name || !email || !password || !confirmPassword || !isChecked;
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
        showsVerticalScrollIndicator={false}
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
              {" "}
              <View>
                <AntDesign name="arrowleft" size={24} color="black" />
              </View>
              <View style={styles.testx}>
                <Text style={styles.reegister}>Register</Text>
              </View>
            </Link>
          </View>
          <View style={styles.createups}>
            <View>
              <Text style={styles.enadp}>Email and Password</Text>
            </View>
            <View style={{ marginTop: 4 }}>
              <Text style={styles.greetings}>
                Welcome to Original Aso-Ebi! Please provide your email address
                and create a password to create your account.
              </Text>
            </View>
            <View style={styles.inputs}>
              <View style={{ marginTop: 4 }}>
                <Text style={styles.labell}>Full Name</Text>
                <View style={{ marginTop: 8 }}>
                  <TextInput
                    style={styles.inputt}
                    placeholder="John Doe"
                    keyboardType="default"
                    value={name}
                    onChangeText={(text) => setname(text)}
                    placeholderTextColor="#999"
                  />
                </View>
                <Text style={styles.error}>{nameError}</Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text style={styles.labell}>Email</Text>
                <View style={{ marginTop: 8 }}>
                  <TextInput
                    style={styles.inputt}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholder="youremail@here.com"
                    keyboardType="email-address" // Change this to 'password' or 'default' for different types
                    placeholderTextColor="#999" // Change placeholder text color here
                    autoCapitalize="none"
                  />
                </View>
                <Text style={styles.error}>{emailError}</Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text style={styles.labell}>Phone Number</Text>
                <View style={{ marginTop: 8 }}>
                  <TextInput
                    style={styles.inputt}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    placeholder="09074927137"
                    keyboardType="phone-pad" // Use 'phone-pad' for phone number input
                    placeholderTextColor="#999" // Change placeholder text color here
                    maxLength={15} // Optional: Limit input length
                  />
                </View>
                <Text style={styles.error}>{phoneError}</Text>
              </View>

              <View style={{ marginTop: 4 }}>
                <Text style={styles.labell}>Password</Text>
                <View style={{ marginTop: 8 }}>
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
              <View style={{ marginTop: 4 }}>
                <Text style={styles.labell}>Confirm Password</Text>
                <View style={{ marginTop: 8 }}>
                  <View
                    style={[
                      styles.scares,
                      {
                        borderColor: isInputFocused2 ? "black" : "gray",
                        borderWidth: isInputFocused2 ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.inpu2}
                        placeholder="*********"
                        secureTextEntry={!showPassword2}
                        placeholderTextColor="#999"
                        underlineColorAndroid="transparent"
                        value={confirmPassword}
                        onChangeText={(text) => setConfirmPassword(text)}
                        onFocus={handleFocus2}
                        onBlur={handleBlur2}
                      />
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => setShowPassword2(!showPassword2)}
                      >
                        <Feather
                          name={showPassword2 ? "eye" : "eye-off"}
                          size={20}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.error}>{confirmPasswordError}</Text>
              </View>
              <View style={{ marginTop: 18 }}>
                <TouchableOpacity
                  onPress={toggleCheckbox}
                  style={styles.checkboxContainer}
                >
                  <View style={[styles.checkbox, isChecked && styles.checked]}>
                    {isChecked && (
                      <Feather name="check" size={13} color="white" />
                    )}
                  </View>
                  <Text style={styles.label}>
                    I have read and agree to the{" "}
                    <Text style={styles.others}>Terms and Conditions</Text> and{" "}
                    <Text style={styles.others}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
                <Text style={styles.error}>{checkError}</Text>
              </View>
              <View style={{ marginTop: 20, marginBottom: 30 }}>
                <TouchableOpacity
                  style={[styles.create, { opacity: isDisabled ? 0.5 : 1 }]} // Apply faded style based on the combined disabled state
                  onPress={handleCreateAccount}
                  disabled={isDisabled} // Disable button based on combined conditions
                >
                  <Text style={{ color: "white" }}>
                    {loading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={{ color: "white" }}>Create Account</Text>
                    )}
                  </Text>
                </TouchableOpacity>

                <View>
                  <TouchableOpacity style={styles.already}>
                    <Link href="/login">
                      <Text>Already have an account? Login</Text>
                    </Link>
                  </TouchableOpacity>
                </View>
                {/* <View>
                  <TouchableOpacity style={styles.already}>
                    <Link href="/otpverification">
                      <Text>otp</Text>
                    </Link>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
    marginTop: "30px",
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
    fontFamily: "Lora_400Regular",
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
    fontFamily: "Lora_400Regular",
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
    // marginBottom: 13,
    fontSize: 16,
  },
  error: {
    color: "red",
    fontFamily: "Lora_400Regular",
    fontSize: 14,

    marginTop: 4,
    marginBottom: 8,
  },
  toasr: {
    position: "absolute", // Make sure the toast is positioned absolutely
    top: 0, // Adjust the top position if needed
    left: 0, // Align with the left edge
    right: 0, // Align with the right edge
    zIndex: 1000, // Bring the toast to the front

    padding: 10, // Add padding for a better appearance
    borderRadius: 10, // Optional: add border-radius for rounded corners
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
