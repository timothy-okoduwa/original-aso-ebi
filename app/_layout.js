import { useEffect } from 'react';

import { Slot } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { CartProvider } from './CartContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import { LoadingProvider } from './LoadingContext'; // Import LoadingProvider
import LoadingIndicator from './LoadingIndicator'; // Import LoadingIndicator
export default function Layout() {
  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };
    getPermission();
  }, []);
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <CartProvider>
            <LoadingProvider>
              <StatusBar
                style="dark"
                backgroundColor="#FFFFFF"
                translucent={false}
              />
              <Slot />
              <LoadingIndicator />
            </LoadingProvider>
          </CartProvider>
        </Provider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // ensure this matches your design
  },
});
