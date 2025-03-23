/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import p from "../constants/image/profile.png";
import * as ImagePicker from "expo-image-picker";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useLoading } from "../app/contexts/LoadingContext";
import { AuthContext } from "../app/_layout";

export default function SettingContent({ userName, UserData }) {
  // All hook calls must be at the top level and in the same order every render
  // 1. Get all the context values first
  const { showLoading, hideLoading } = useLoading();
  const { setIsAuthenticated } = useContext(AuthContext);
  
  // 2. Then all the React hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(p);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  
  // 3. Hook for fonts
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });
  
  console.log(UserData);
  
  // 4. Effects
  useEffect(() => {
    const getStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId"); // Fetch userId
  
        if (!storedToken || !storedUserId) {
          Alert.alert("Session Expired", "Please login again");
          router.push("/login");
          return;
        }
  
        setToken(storedToken);
        setUserId(storedUserId); // Set userId
      } catch (error) {
        console.error("Error retrieving stored data:", error);
        Alert.alert("Error", "Failed to load user data");
      }
    };
    getStoredData();
  }, [router]);
  
  useEffect(() => {
    console.log("SettingContent received:", { userName, UserData });
  }, [userName, UserData]);
  if (!fontsLoaded || fontError) {
    return <Text>Loading...</Text>;  }

  const createFormData = async (uri) => {
    const filename = uri.split("/").pop();
    const extension = filename.split(".").pop().toLowerCase();

    const formData = new FormData();
    formData.append("profilePic", {
      uri,
      type: extension === "jpg" ? "image/jpeg" : `image/${extension}`,
      name: `profile-${Date.now()}.${extension}`,
    });

    return formData;
  };

  const uploadImage = async (formData) => {
    if (!token || !userId) {
      Alert.alert("Authentication Error", "You are not logged in. Please log in again.");
      router.push("/login");
      return;    }

    const url = `https://oae-be.onrender.com/api/oae/auth/${userId}/update-image`;

    // Log the request details
    console.log("Making request to:", url);
    console.log("With headers:", {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return response;
  };

  const chooseImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
        aspect: [1, 1],
      });

      if (result.canceled) return;

      setIsLoading(true);
      const profilePic = result.assets[0].uri;

      try {
        const formData = await createFormData(profilePic); // Pass `profilePic` directly
        await uploadImage(formData);
        setProfileImage({ uri: profilePic });
        Alert.alert("Success", "Profile image updated successfully");
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("Error", "Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Start by showing loading indicator
      showLoading();
      
      // Remove the token from AsyncStorage
      await AsyncStorage.removeItem('token');
    
      // Update auth context
      setIsAuthenticated(false);
      
      // Hide loading and let the router handle redirection
      hideLoading();
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
      hideLoading();
    }
  };

  const logout = () => {
    handleLogout();
  };
  
  const editprofile = () => {
    router.push("/editprofile");
  };
  
  const forgetpassword = () => {
    router.push("/forgetpassword");
  };
  if (!userName && !UserData) {
    console.log("SettingContent: No user data available");
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load user data</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            console.log("Retry button pressed");
            // Add a retry mechanism
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View>
      <View style={styles.imagestuff}>
        <View style={styles.flexer}>
          <View style={styles.setimage}>
          <Image
  source={
    UserData && typeof UserData === 'string' && UserData.startsWith('http')
      ? { uri: UserData }
      : profileImage && profileImage.uri
      ? profileImage
      : p
  }
  style={styles.image}
  resizeMode="cover"
/>
          </View>
          <View style={{ marginTop: 14 }}>
            <Text style={styles.names}>
              {userName ? userName : "Demi Bankole"}
            </Text>
          </View>
          <View style={{ marginTop: 14 }}>
            <TouchableOpacity
              style={[styles.update, isLoading && { opacity: 0.7 }]}
              onPress={chooseImage}
              disabled={isLoading}
            >
              <Text style={styles.updatetext}>
                {" "}
                {isLoading ? "Uploading..." : "Update Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 30 }}>
        <View>
          <Text style={styles.othset}>Settings</Text>
          {/* <Text>user id{userId}</Text> */}
        </View>
        <TouchableOpacity
          style={{ marginTop: 50, width: "100%" }}
          onPress={editprofile}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <FontAwesome5 name="user-circle" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Edit Profile</Text>
                <Text style={styles.ed2}>Update your profile</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, width: "100%" }}
          onPress={forgetpassword}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="password" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Change Password</Text>
                <Text style={styles.ed2}>Update your password here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 50, width: "100%" }}
          onPress={logout}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="logout" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Log out</Text>
                <Text style={styles.ed2}>Log out of your account here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imagestuff: {
    width: "100%",
    // height: 200,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    marginTop: 30, // Use a number instead of a string
  },
  flexer: {
    justifyContent: "center", // Centers content vertically inside the flexer
    alignItems: "center", // Centers content horizontally inside the flexer
    width: "60%",

    padding: 10, // Add padding to better fit the content
  },
  setimage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  image: {
    width: "100%", // Matches the parent View's width
    height: "100%", // Matches the parent View's height
    borderRadius: 50,
  },
  names: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
    color: "#2E2E2E",
  },
  update: {
    width: 123,
    height: 41,
    borderRadius: 9,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  updatetext: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  othset: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    color: "#2E2E2E",
  },
  fiue: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flexer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  roundz: {
    width: 37.56,
    height: 37.56,
    borderRadius: 50,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  editt: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#000000",
  },
  ed2: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
    color: "#888888",
  },
});
