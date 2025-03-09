/** @format */

import React, { useEffect } from "react";
import { Slot, usePathname, useRouter } from "expo-router";
import { CartProvider } from "./CartContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setUser } from "../components/features/auth/authSlice";
import { store } from "./store";
import { setToken } from "../components/features/auth/authSlice"; // Import setToken action
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingProvider } from "./LoadingContext";
import LoadingIndicator from "./LoadingIndicator";
import { OrderProvider } from "./OrderContext";
// MainComponent that will check for token inside the Provider
const MainComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentPath = usePathname();
  
  // This function handles forced logout separately
  const checkForceLogout = async () => {
    try {
      const forceLogout = await AsyncStorage.getItem("forceLogout");
      if (forceLogout === "true") {
        console.log("Force logout detected, redirecting to login");
        await AsyncStorage.removeItem("forceLogout");
        
        // Force navigation regardless of current path
        if (currentPath !== '/login') {
          router.replace("/login");
          return true; // Indicate we're handling forced logout
        }
      }
      return false; // No forced logout
    } catch (error) {
      console.error("Error checking force logout:", error);
      return false;
    }
  };
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      // First check for forced logout - do this before anything else
      const isForceLogout = await checkForceLogout();
      if (isForceLogout) return;
      
      // Skip auth check for login-related paths
      if (
        currentPath === '/login' || 
        currentPath === '/createaccount' || 
        currentPath === '/forgetpassword' ||
        currentPath === '/resetlinksent' ||
        currentPath === '/resetpassword' ||
        currentPath === '/passwordresetsuccessful' ||
        currentPath === '/onboarding'
      ) {
        return;
      }
      
      try {
        const token = await AsyncStorage.getItem("token");
        
        // If no token, redirect to login immediately
        if (!token) {
          console.log("No token found, redirecting to login");
          router.replace("/login");
          return;
        }
        
        // Otherwise, normal auth flow continues...
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          dispatch(setUser({ _id: userId }));
          if (currentPath === '/') {
            router.replace("/mainhome");
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.replace("/login");
      }
    };
    
    checkAuthStatus();
  }, [dispatch, router, currentPath]);

  return (
    <>
      <Slot />
      <LoadingIndicator />
    </>
  );
};

// Layout component remains the same, with Provider wrapping the whole structure
export default function Layout() {
  // useEffect(() => {
  //   const getPermission = async () => {
  //     const { status } = await Notifications.getPermissionsAsync();
  //     if (status !== 'granted') {
  //       await Notifications.requestPermissionsAsync();
  //     }
  //   };
  //   getPermission();
  // }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <CartProvider>
            <OrderProvider>
              <LoadingProvider>
                <StatusBar
                  style="dark"
                  backgroundColor="#FFFFFF"
                  translucent={false}
                />
                <MainComponent />
              </LoadingProvider>
            </OrderProvider>
          </CartProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
