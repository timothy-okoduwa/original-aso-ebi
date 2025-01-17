/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native"; // Add Alert import
import React, { useState, useEffect } from "react";
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
import { setUser } from "./features/auth/authSlice";
export default function SettingContent({ userName }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(p); // Default profile image
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    getUserId();
  }, []);
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const logout = async () => {
    try {
      // Remove userId from AsyncStorage
      await AsyncStorage.removeItem("userId");

      // Verify userId removal
      const userId = await AsyncStorage.getItem("userId");
      console.log("userId after logout:", userId); // Should log 'null'

      // Clear Redux state if applicable (optional)
      dispatch(setUser(null));

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const editprofile = () => {
    router.push("/editprofile");
  };
  const forgetpassword = () => {
    router.push("/forgetpassword");
  };

  const chooseImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You need to grant permission to access your photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setIsLoading(true);
        const imageUri = result.assets[0].uri;

        if (!userId) {
          Alert.alert("Error", "User ID not found. Please log in again.");
          return;
        }

        const formData = new FormData();
        const fileExtension = imageUri.split(".").pop();

        formData.append("image", {
          uri: imageUri,
          name: `profile-image.${fileExtension}`,
          type: `image/${fileExtension}`,
        });

        const endpoints = [
          `https://oae-be.onrender.com/api/oae/auth/${userId}/update-image`,
          `https://oae-be.onrender.com/oae/auth/${userId}/update-image`,
          `https://oae-be.onrender.com/api/auth/${userId}/update-image`,
          `https://oae-be.onrender.com/auth/${userId}/update-image`,
        ];

        let response;
        let errorDetails = [];

        for (const endpoint of endpoints) {
          try {
            console.log("Trying endpoint:", endpoint);
            response = await fetch(endpoint, {
              method: "PATCH",
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
              body: formData,
            });

            if (response.ok) {
              console.log("Successful endpoint:", endpoint);
              const data = await response.json();
              console.log("Parsed response:", data);

              setProfileImage({ uri: imageUri });
              Alert.alert("Success", "Profile image updated successfully!");
              return; // Exit the loop on success
            } else {
              console.log(
                `Failed with status ${response.status} for endpoint: ${endpoint}`
              );
              errorDetails.push({ endpoint, status: response.status });
            }
          } catch (error) {
            console.error(`Error with endpoint ${endpoint}:`, error.message);
            errorDetails.push({ endpoint, error: error.message });
          }
        }

        throw new Error(
          `Failed to upload image. Errors: ${JSON.stringify(
            errorDetails,
            null,
            2
          )}`
        );
      }
    } catch (error) {
      console.error("Error uploading image:", error.message);
      Alert.alert("Error", `Failed to upload image: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.imagestuff}>
        <View style={styles.flexer}>
          <View style={styles.setimage}>
            <Image
              source={profileImage}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={{ marginTop: "14" }}>
            <Text style={styles.names}>
              {userName ? userName : "Demi Bankole"}
            </Text>
          </View>
          <View style={{ marginTop: "14" }}>
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
      <View style={{ marginTop: "30" }}>
        <View>
          <Text style={styles.othset}>Settings</Text>
          {/* <Text>user id{userId}</Text> */}
        </View>
        <TouchableOpacity
          style={{ marginTop: "50", width: "100%" }}
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
          style={{ marginTop: "50", width: "100%" }}
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
          style={{ marginTop: "50", width: "100%" }}
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
    width: "100",
    height: "100",
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
    width: "123",
    height: "41",
    borderRadius: "9",
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
    gap: "10",
  },
  flexer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  roundz: {
    width: "37.56",
    height: "37.56",
    borderRadius: "50%",
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
