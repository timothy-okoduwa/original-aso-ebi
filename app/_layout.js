import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { CartProvider } from './CartContext';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { setToken } from '../components/features/auth/authSlice'; // Import setToken action
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoadingProvider } from './LoadingContext';
import LoadingIndicator from './LoadingIndicator';

// MainComponent that will check for token inside the Provider
const MainComponent = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // If token exists, set it in Redux state
          dispatch(setToken(token));
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading token from AsyncStorage:', error);
      }
    };

    checkToken();
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
              <MainComponent />
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
    backgroundColor: '#FFFFFF',
  },
});
