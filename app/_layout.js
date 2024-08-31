import React from 'react';
import { Slot } from 'expo-router';
import { CartProvider } from './CartContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import { LoadingProvider } from './LoadingContext'; // Import LoadingProvider
import LoadingIndicator from './LoadingIndicator'; // Import LoadingIndicator
export default function Layout() {
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
