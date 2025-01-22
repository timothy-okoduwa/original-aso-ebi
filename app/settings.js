/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import ButtomNav from "../components/ButtomNav";
import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter } from "expo-router";
import SettingContent from "../components/SettingContent";
import { useLoading } from "./LoadingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function settings() {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const [UserData, setUserData] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (userId && token) {
          // Fetch the user data from the API using the userId and token
          const response = await fetch(
            `https://oae-be.onrender.com/api/oae/auth/${userId}/user`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const responseData = await response.json();

          console.log("API Response:", responseData); // Log the entire response for debugging

          if (response.ok) {
            // Check if responseData and responseData.data exist
            if (responseData && responseData.data) {
              const fetchedUserName = responseData.data.name || "John Doe"; // Get the name from the response
              const fetchedUserPics =
                responseData.data.profilePic || "John Doe"; // Get the name from the response
              setUserName(fetchedUserName); // Update state with user data
              setUserData(fetchedUserPics);
            } else {
              console.error("Error: User data is missing in the response.");
              setUserName("John Doe"); // Provide fallback value
            }
          } else {
            console.error(
              "Error fetching user data:",
              responseData.message || "Failed to fetch user"
            );
          }
        } else {
          console.log("No userId or token found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Simulate data loading
    showLoading();
    const timeout = setTimeout(() => {
      hideLoading();
    }, 1000); // Adjust the timeout to simulate data loading time

    return () => clearTimeout(timeout);
  }, []);
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // After 2 seconds stop refreshing
      setRefreshing(false);
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Settings</Text>
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
        <View style={styles.main}>
          <SettingContent userName={userName} UserData={UserData} />
        </View>
      </ScrollView>
      <ButtomNav />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0, // Adjust this value to accommodate the height of your ButtomNav component
    paddingTop: 100, // Add enough padding to the top to avoid overlap
  },
  main: {
    padding: 15,
    flex: 1,
  },
  storeview: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // zIndex: 1,
    backgroundColor: "white",
    padding: 15,
    paddingTop: 45,
    alignItems: "center",
  },
  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 40,
  },
  pushdown: {
    marginTop: 20,
    marginBottom: 30,
  },
  select: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 30,
    width: "48%",
    borderRadius: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  imageText: {
    color: "white",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
  },
});
