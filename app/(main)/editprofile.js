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
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
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

export default function editprofile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Get user ID and token from AsyncStorage and fetch user data on component mount
  useEffect(() => {
    const getUserDataAndFetch = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        const userToken = await AsyncStorage.getItem("token");
        
        setUserId(id);
        setToken(userToken);
        
        if (id && userToken) {
          await fetchUserData(id, userToken);
        } else {
          setErrorMessage("User credentials not found. Please log in again.");
        }
      } catch (error) {
        console.error("Error getting user credentials:", error);
        setErrorMessage("Could not retrieve user information");
      }
    };
    
    getUserDataAndFetch();
  }, []);
  
  // Function to fetch current user data
  const fetchUserData = async (id, userToken) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/auth/${id}/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const responseData = await response.json();
      console.log("API Response:", responseData); // Log the entire response for debugging

      if (response.ok) {
        // Check if responseData and responseData.data exist
        if (responseData && responseData.data) {
          const fetchedName = responseData.data.name || "";
          setName(fetchedName); // Update state with user name
        } else {
          console.error("Error: User data is missing in the response.");
          setErrorMessage("Could not retrieve user data");
        }
      } else {
        console.error(
          "Error fetching user data:",
          responseData.message || "Failed to fetch user"
        );
        setErrorMessage(responseData.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user profile
  const updateProfile = async () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your name");
      return;
    }
    
    if (!userId || !token) {
      setErrorMessage("User credentials not found. Please log in again.");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      const response = await fetch(`https://oae-be.onrender.com/api/oae/auth/${userId}/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }
      
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const back = () => {
    router.back();
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
            <Text style={styles.reegister}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.createups}>
          <View>
            <Text style={styles.enadp}>Edit your Profile</Text>
          </View>

          <View style={styles.inputs}>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labell}>name</Text>
              <View style={{ marginTop: 16 }}>
                <TextInput
                  style={styles.inputt}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#999"
                />
              </View>
              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : null}
            </View>

            <View style={{ marginBottom: 30, marginTop: 40 }}>
              <TouchableOpacity 
                style={[styles.create, isLoading && styles.disabledButton]} 
                onPress={updateProfile}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white" }}>Done</Text>
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
    backgroundColor: "blue",
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
  disabledButton: {
    backgroundColor: "#666666",
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
    marginTop: 17,
    marginBottom: 80,
  },
  clckforget: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 16,
    lineHeight: 18,
    textAlign: "left",
    color: "#1D1D1D",
  },
});