/** @format */

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
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import { StatusBar } from "expo-status-bar";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function resetpassword() {
  const router = useRouter();
  const back = () => {
    router.push('/settings');
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isInputFocused2, setIsInputFocused2] = useState(false);
  const [password, setPassword] = useState("");
  const [checkPassword, setcheckPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setcheckPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const validatecheckPassword = () => {
    if (checkPassword.trim() === "") {
      setcheckPasswordError("Confirm password is required");
      return false;
    }
    if (checkPassword !== password) {
      setcheckPasswordError("Passwords do not match");
      return false;
    }
    setcheckPasswordError("");
    return true;
  };

  const changePassword = async () => {
    try {
      setIsLoading(true);
      
      // Get userId from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Make API call to change password
      const response = await fetch(`https://oae-be.onrender.com/api/oae/auth/${userId}/change-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          checkPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Server response:", data); // Log the full server response
        throw new Error(data.message || 'Failed to reset password');
      }

      // Success - navigate to success screen
      router.push("/passwordresetsuccessful");
    } catch (error) {
      console.error("Password change error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to change password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    const isPasswordValid = validatePassword();
    const ischeckPasswordValid = validatecheckPassword();

    // If all fields are valid, proceed with API call
    if (isPasswordValid && ischeckPasswordValid) {
      changePassword();
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
            <Text style={styles.reegister}>Reset</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Create a new password</Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.greetings}>
              Welcome to Original Aso-Ebi! Please create a new secure password for your account.
            </Text>
          </View>
          <View style={styles.inputs}>
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
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.error}>{passwordError}</Text>
              </View>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labell}>Confirm Password</Text>
              <View style={{ marginTop: 16 }}>
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
                      value={checkPassword}
                      onChangeText={(text) => setcheckPassword(text)}
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
              <View style={{ marginBottom: 10 }}>
                <Text style={styles.error}>{checkPasswordError}</Text>
              </View>
            </View>

            <View style={{ marginTop: 70, marginBottom: 30 }}>
              <TouchableOpacity
                style={styles.create}
                onPress={handleCreateAccount}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontFamily: "KumbhSans_500Medium" }}>Done</Text>
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
    marginTop: 80,
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
  scares: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingRight: 20,
  },
  inputContainer: {
    flex: 1,
  },
  inpu2: {
    borderColor: "transparent",
    borderWidth: 0,
    outlineColor: "transparent",
    outlineWidth: 0,
    height: 50,
    width: "auto",
    paddingLeft: 20,
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
  error: {
    color: "red",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    marginTop: 9,
  },
});