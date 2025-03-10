/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import HeadAndNotification from "../components/HeadAndNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SearchCompnent from "../components/SearchCompnent";
import Categories from "../components/Categories";
import FabricData from "../components/FabricData";
import ButtomNav from "../components/ButtomNav";
import { StatusBar } from "expo-status-bar";
import { useLoading } from "./LoadingContext";
import { Link, useRouter } from "expo-router";
import { AuthManager } from "./AuthManager";

export default function mainhome() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // First useEffect - Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuthenticated = await AuthManager.isAuthenticated();
        const isLoggingOut = await AuthManager.isLoggingOut();
        
        // Skip redirect if we're in the process of logging out
        if (!isAuthenticated && !isLoggingOut) {
          console.log("User not authenticated, redirecting to login");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  // Second useEffect - Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (userId && token) {
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

          if (response.ok && responseData?.data) {
            const fetchedUserName = responseData.data.name || "John Doe";
            setUserName(fetchedUserName);
          } else {
            console.error(
              "Error fetching user data:",
              responseData.message || "Failed to fetch user"
            );
            setUserName("John Doe");
          }
        } else {
          console.log("No userId or token found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    showLoading();
    const timeout = setTimeout(() => {
      hideLoading();
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Handle search query changes
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle category changes
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Conditional rendering after all hooks have been called
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000000"
            title="Pull to refresh..."
            titleColor="#000000"
          />
        }
      >
        <View style={styles.main}>
          <HeadAndNotification userName={userName} />
          <SearchCompnent setSearchQuery={handleSearch} />
          <Categories
            setActiveCategory={handleCategoryChange}
            activeCategory={activeCategory}
          />
          <FabricData
            activeCategory={activeCategory}
            searchQuery={searchQuery}
          />
        </View>
      </ScrollView>
      <ButtomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  main: {
    padding: 15,
    flex: 1,
  },  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});