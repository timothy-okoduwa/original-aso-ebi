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
import ButtomNav from "../../components/ButtomNav";
import { StatusBar } from "expo-status-bar";

import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter } from "expo-router";
import { useLoading } from "../contexts/LoadingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SettingContent from "../../components/SettingContent"

export default function settings() {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const [UserData, setUserData] = useState("");
  useEffect(() => {
  // In settings.js
const fetchUserData = async () => {
  try {
    showLoading();
    const userId = await AsyncStorage.getItem("userId");
    const token = await AsyncStorage.getItem("token");

    console.log("Fetching user data with userId:", userId?.substring(0, 5) + "...");
    
    if (!userId || !token) {
      console.error("Missing userId or token");
      hideLoading();
      return;
    }

    const url = `https://oae-be.onrender.com/api/oae/auth/${userId}/user`;
    console.log("Making API request to:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    console.log("API Response status:", response.status);
    
    if (response.ok) {
      if (responseData && responseData.data) {
        setUserName(responseData.data.name || "John Doe");
        setUserData(responseData.data.profilePic || null);
        console.log("Successfully set user data");
      } else {
        console.error("Error: User data missing in response", responseData);
      }
    } else {
      console.error("Error fetching user data:", responseData.message);
    }
  } catch (error) {
    console.error("Error in fetchUserData:", error.message);
  } finally {
    hideLoading();
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
    return <Text>Loading...</Text>;
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
