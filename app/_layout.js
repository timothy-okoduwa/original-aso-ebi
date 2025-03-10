/** @format */

import React, { useEffect,useState } from "react";
import { Slot, useRouter, useSegments, usePathname } from "expo-router";
import { CartProvider } from "./CartContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Provider, useDispatch } from "react-redux";
import { setUser, setToken } from "../components/features/auth/authSlice";
import { store } from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingProvider } from "./LoadingContext";
import LoadingIndicator from "./LoadingIndicator";
import { OrderProvider } from "./OrderContext";
import { AuthManager } from "./AuthManager";

// Auth context to manage protected routes
const AuthContext = React.createContext(null);

// Use this hook to check if a user is authenticated
// Update your useProtectedRoute hook
function useProtectedRoute(shouldProtect) {
  const segments = useSegments();
  const router = useRouter();
  const currentPath = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Public routes that don't require authentication
  const publicPaths = ['/login', '/register', '/onboarding', '/otpverification', '/forgetpassword'];
  
  // Check for logout state
  useEffect(() => {
    const checkLoggingOut = async () => {
      const loggingOut = await AuthManager.isLoggingOut();
      setIsLoggingOut(loggingOut);
    };
    
    checkLoggingOut();
  }, []);
  
  useEffect(() => {
    // Don't do anything if we're not initialized yet or there are no segments
    if (!shouldProtect || !segments.length || isLoggingOut) return;
    
    const isAuthenticated = shouldProtect; // Since shouldProtect is isInitialized && isAuthenticated
    
    // If the route is not in public paths and user is not authenticated
    if (!publicPaths.includes(currentPath) && !isAuthenticated) {
      // Redirect to login
      router.replace('/login');
    } else if (isAuthenticated && publicPaths.includes(currentPath) && currentPath !== '/forgetpassword') {
      // If user is authenticated and trying to access a public path (except password reset)
      // Redirect to home
      router.replace('/mainhome');
    }
  }, [shouldProtect, segments, currentPath, router, isLoggingOut]);

  return null;
}

// Authentication provider component
// Authentication provider component
function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const isUserLoggedOut = await AuthManager.isUserLoggedOut();
        
        setIsAuthenticated(!!token && !!userId && !isUserLoggedOut);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkAuth();
  }, []);
  
  // Call the hook unconditionally
  useProtectedRoute(isInitialized && isAuthenticated);
  
  if (!isInitialized) {
    // Return a minimal placeholder until auth is checked
    return null;
  }
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Main component inside Providers
const MainComponent = () => {
  const dispatch = useDispatch();
  
  // Load user data into Redux store if needed
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        
        if (token && userId) {
          dispatch(setToken(token));
          // You might want to fetch user data from API here
          // and dispatch setUser with the fetched data
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, [dispatch]);

  return (
    <>
      <Slot />
      <LoadingIndicator />
    </>
  );
};

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