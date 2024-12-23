/** @format */

import React, { useEffect } from "react";
import { Slot, useRouter } from "expo-router";
import { CartProvider } from "./CartContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Provider, useDispatch } from "react-redux";
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

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          dispatch(setUser({ _id: userId }));
          router.replace("/mainhome");
        } else {
          router.replace("/"); // Ensure this matches the logout redirection
        }
      } catch (error) {
        console.error("Error loading userId:", error);
        router.replace("/login");
      }
    };

    checkUserId();
  }, [dispatch, router]);

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
