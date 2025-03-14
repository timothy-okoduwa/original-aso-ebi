import React, { useEffect, useMemo, useState } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { CartProvider } from "./contexts/CartContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingProvider } from "./contexts/LoadingContext";
import LoadingIndicator from "./(main)/LoadingIndicator";
import { OrderProvider } from "./contexts/OrderContext";

export const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check authentication status only once on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Handle navigation separately, with safeguards to prevent navigation loops
  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading
    
    const inAuthGroup = segments[0] === "(auth)";
    const inMainGroup = segments[0] === "(main)";
    
    // Only navigate if we're in the wrong group
    if (!isAuthenticated && !inAuthGroup) {
      // If not authenticated and not in auth group, go to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // If authenticated and still in auth group, go to main
      router.replace("/(main)/mainhome");
    }
    // No navigation needed if already in the correct section
    
  }, [isAuthenticated, segments, isLoading, router]);
  
  // Memoize the context value
  const authContextValue = useMemo(() => {
    return { isAuthenticated, setIsAuthenticated };
  }, [isAuthenticated]);
  
  if (isLoading) {
    // Return a loading state while checking authentication
    return (
      <AuthContext.Provider value={authContextValue}>
        <LoadingIndicator />
      </AuthContext.Provider>
    );
  }
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Memoized MainComponent to prevent unnecessary re-renders
const MainComponent = React.memo(() => {
  return (
    <>
      <Slot />
      <LoadingIndicator />
    </>
  );
});

export default function Layout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <CartProvider>
            <OrderProvider>
              <LoadingProvider>
                <AuthProvider>
                  <StatusBar
                    style="dark"
                    backgroundColor="#FFFFFF"
                    translucent={false}
                  />
                  <MainComponent />
                </AuthProvider>
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