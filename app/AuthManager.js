/** @format */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const AuthManager = {
  // Check if user is logged out flag
  isUserLoggedOut: async () => {
    try {
      const loggedOutStatus = await AsyncStorage.getItem("userLoggedOut");
      return loggedOutStatus === "true"; // Convert string to boolean
    } catch (error) {
      console.error("Error checking logged out status:", error);
      return true; // Default to logged out for security
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      const isLoggedOut = await AuthManager.isUserLoggedOut();
      
      return !!token && !!userId && !isLoggedOut;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  },
  
  // Handle logout - clear all auth data before navigation
  logout: async () => {
    try {
      // Set a temporary flag to prevent redirect loops
      await AsyncStorage.setItem('isLoggingOut', 'true');
      
      // Clear auth data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.setItem('isLoggedOut', 'true');
      
      // Clear the logout flag after a short delay
      // This gives time for navigation to complete
      setTimeout(async () => {
        await AsyncStorage.removeItem('isLoggingOut');
      }, 2000);
      
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },
  
  isLoggingOut: async () => {
    try {
      return await AsyncStorage.getItem('isLoggingOut') === 'true';
    } catch (error) {
      return false;
    }
  },
  
  // Handle login
  login: async (token, userId) => {
    try {
      // Store token and userId if provided
      if (token) {
        await AsyncStorage.setItem("token", token);
      }
      
      if (userId) {
        await AsyncStorage.setItem("userId", userId);
      }
      
      // Set logged out flag to false
      await AsyncStorage.setItem("userLoggedOut", "false");
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },
  
  // Redirect to login if not authenticated
  redirectIfNotAuthenticated: async () => {
    const isAuth = await AuthManager.isAuthenticated();
    if (!isAuth) {
      router.replace("/login");
      return false;
    }
    return true;
  },
  
  // Complete OTP verification and navigate
  completeOtpVerification: async () => {
    try {
      await AsyncStorage.setItem("userLoggedOut", "false");
      router.replace("/login");
      return true;
    } catch (error) {
      console.error("Navigation error:", error);
      return false;
    }
  },
  
  // Navigate to OTP verification
  navigateToOtpVerification: async (userId, email) => {
    try {
      await AsyncStorage.setItem("tempUserId", userId);
      await AsyncStorage.setItem("tempEmail", email);
      router.replace({
        pathname: "/otpverification",
        params: { userId, email }
      });
      return true;
    } catch (error) {
      console.error("Navigation error:", error);
      return false;
    }
  }
};