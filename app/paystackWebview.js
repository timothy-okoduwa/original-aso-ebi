import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useOrder } from './contexts/OrderContext';
import { useContext } from 'react';
import { CartContext } from "./contexts/CartContext";
import PaymentSuccessModal from '../components/PaymentSuccessModal';

export default function PaystackWebview() {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showErrorOverlay, setShowErrorOverlay] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const webViewRef = useRef(null);
  const params = useLocalSearchParams();
  const router = useRouter();

  const { clearCart } = useContext(CartContext);
  useEffect(() => {
    console.log("clearCart function exists:", typeof clearCart === 'function');
  }, [clearCart]);
  const { 
    authorizationUrl, 
    reference, 
    transactionId,
    paymentType, 
    totalAmount, 
    orderedItems, 
    numberOfItems,
    totalQuantity,
    orderDetails
  } = params;

  // Improved injected JavaScript to detect cancel buttons
  const injectedJavaScript = `
  (function() {
    // Function to check and add listener to any buttons
    function addCancelPaymentListener() {
      console.log('Checking for cancel payment button');
      
      // Try multiple selectors to find the cancel button
      const cancelButtons = document.querySelectorAll('button, a');
      for (let i = 0; i < cancelButtons.length; i++) {
        const button = cancelButtons[i];
        if (
          button.textContent.includes('Cancel') || 
          button.textContent.includes('cancel') ||
          button.id.includes('cancel') ||
          button.className.includes('cancel')
        ) {
          console.log('Found cancel button:', button.textContent);
          button.addEventListener('click', function(e) {
            console.log('Cancel button clicked');
            window.ReactNativeWebView.postMessage('CANCEL_PAYMENT_CLICKED');
          });
        }
      }
      
      // Check again after a delay
      setTimeout(addCancelPaymentListener, 3000);
    }
    
    // Start looking for buttons
    addCancelPaymentListener();
    
    true;
  })();
  `;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUserId && storedToken) {
          setUserId(storedUserId);
          setToken(storedToken);
          setLoading(false);
        } else {
          Alert.alert("Error", "User data not found. Please login again.");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
        router.back();
      }
    };
    
    getUserData();
  }, []);

  const updateTransactionStatus = async () => {
    console.log("Transaction data check:", {
      userId,
      token: token ? token.substring(0, 10) + '...' : null,
      transactionId,
      reference
    });
    
    if (!userId || !token || !transactionId || !reference) {
      console.error("Missing required transaction data");
      setShowErrorOverlay(true);
      return false;
    }
    
    try {
      console.log(`Making API call to: https://oae-be.onrender.com/api/oae/payments/transaction/${transactionId}/${userId}`);
      console.log(`With reference: ${reference}`);
      
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/payments/transaction/${transactionId}/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reference: reference
          })
        }
      );
      
      // Check if response is ok before parsing JSON
      if (!response.ok) {
        console.error(`Transaction API returned status: ${response.status}`);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        setShowErrorOverlay(true);
        return false;
      }
      
      const result = await response.json();
      console.log("API response:", result);
      
      if (result.success || result.message === "Payment successful") {
        console.log("Success condition met, creating order via API");
        
        try {
          const parsedItems = typeof orderDetails === 'string' ? JSON.parse(orderDetails) : orderDetails;
          console.log("Parsed ordered items:", parsedItems);
          
          // Debugging the request body before sending
          const orderRequestBody = {
            items: parsedItems.items,
            paymentMethod: paymentType,
            totalQty: Number(totalQuantity),
            deliveryAddress: parsedItems.address,
            phoneNumber: parsedItems.phoneNumber,
            deliveryFee: parsedItems.deliveryFee,
            serviceFee: parsedItems.serviceFee,
            totalAmount: parsedItems.totalAmount,
            transactionRef:reference
          };
          console.log("Complete order request body:", JSON.stringify(orderRequestBody));          
          // Create order using the backend API
          const orderResponse = await fetch(
            `https://oae-be.onrender.com/api/oae/orders/orders/${userId}`,
            {
              method: 'POST',
              headers: {
                'Authorization':`Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(orderRequestBody)
            }
          );
          
          // Check response status and get response as text first
          console.log("Order API status:", orderResponse.status);
          
          // Get response as text to inspect it
          const responseText = await orderResponse.text();
          console.log("Order API raw response:", responseText);
          
          // Try to parse as JSON if possible
          let orderResult;
          try {
            orderResult = responseText ? JSON.parse(responseText) : {};
            console.log("Order creation API response (parsed):", orderResult);
          } catch (parseError) {
            console.error("Failed to parse response as JSON:", parseError);
            console.error("Response that couldn't be parsed:", responseText);
            
            // Check if the response contains HTML error page indicators
            if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {
              console.error("Received HTML instead of JSON. Server might be returning an error page.");
            }
          }
          
          if (orderResponse.ok) {
            console.log("Order created successfully via API");
            console.log("About to clear cart");
            // Clear the cart
            clearCart();
            console.log("Cart cleared");
            console.log("About to return true to show success modal");
            return true;
          } else {
            console.error("Order API returned error status:", orderResponse.status);
            return false;
          }
        } catch (error) {
          console.error("Error creating order via API:", error);
          return false;
        }
      } else {
        console.error("API returned error:", result.message);
        setShowErrorOverlay(true);
        return false;
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      setShowErrorOverlay(true);
      return false;
    }
  };

  const closeModal = () => {
    console.log("Closing success modal");
    setModalVisible(false);
    // Add some delay before navigating back to ensure modal animation completes
    setTimeout(() => {
      router.replace("/orders"); // Consider redirecting to orders page instead of just going back
    }, 300);
  };

  const onMessage = (event) => {
    const data = event.nativeEvent.data;
    console.log('Message received:', data);
    
    if (data === 'CANCEL_PAYMENT_CLICKED') {
      console.log('Cancel payment button clicked');
      router.back();
    }
  };

  const handleNavigationStateChange = async (navState) => {
    console.log('Navigation state changed:', navState.url);
  
    // Add more detailed logging to debug the flow
    console.log('Checking URL for success indicators...');
    
    // Check for successful payment callback with more detailed logging
    if (navState.url.includes('success') || navState.url.includes('callback') || 
        navState.url.includes('oae-dashboard.vercel.app')) {
      console.log('SUCCESS URL DETECTED:', navState.url);
      webViewRef.current?.stopLoading();
      
      // If there's a reference in the URL, extract it
      if (navState.url.includes('reference=') || navState.url.includes('trxref=')) {
        try {
          const urlObj = new URL(navState.url);
          const ref = urlObj.searchParams.get('reference') || urlObj.searchParams.get('trxref');
          if (ref) {
            console.log('Payment successful, reference:', ref);
          }
        } catch (error) {
          console.error('Failed to parse URL:', error);
        }
      }
      
      // Force update transaction status here
      console.log('Updating transaction status...');
      const success = await updateTransactionStatus();
      console.log('Transaction update result:', success);
      
      if (success) {
        console.log('SHOWING SUCCESS MODAL');
        setModalVisible(true);
        console.log('Modal visibility state set to:', true);
        // Add a delay to ensure the modal has time to render
        setTimeout(() => {
          console.log('Modal should be visible now, isModalVisible:', isModalVisible);        }, 500);
      } else {
        console.log('Transaction update failed, navigating back');
        router.back();
      }
      return false;
    }
    // Check for error page or cancellation
    else if (
      navState.url.includes('cancel') || 
      navState.url.includes('failed') ||
      navState.title?.includes('could not start') ||
      navState.title?.includes('transaction') ||
      navState.url.includes('error')
    ) {
      console.log('Error state detected in navigation');
      setShowErrorOverlay(true);
      
      // Also inject JavaScript to detect cancel button clicks
      webViewRef.current?.injectJavaScript(`
        (function() {
          const cancelButton = document.querySelector('button:contains("Cancel Payment")') ||
                              document.querySelector('button:contains("Cancel")') ||
                              document.querySelector('[aria-label="Cancel"]');
          if (cancelButton) {
            cancelButton.onclick = function() {
              window.ReactNativeWebView.postMessage('CANCEL_PAYMENT_CLICKED');
              return false;
            };
          }
          true;
        })();
      `);
    }
  };

  const onShouldStartLoadWithRequest = (request) => {
    console.log('Should start request:', request.url);
    
    // Check if the URL is the callback URL
    if (request.url.includes('oae-dashboard.vercel.app')) {
      // Capture the reference from the URL if needed
      try {
        const urlObj = new URL(request.url);
        const ref = urlObj.searchParams.get('reference') || urlObj.searchParams.get('trxref');
        
        if (ref) {
          console.log('Payment successful, reference:', ref);
          // Process the transaction
          (async () => {
            const success = await updateTransactionStatus();
            if (success) {
              setModalVisible(true);
            } else {
              router.back();
            }
          })();
        }
      } catch (error) {
        console.error('Failed to parse URL:', error);
      }
      
      // Return false to prevent loading this URL
      return false;
    }
    
    // For cancel button detection
    if (request.url.includes('cancel') || request.url.includes('failed')) {
      console.log('Payment cancelled or failed');
      router.back();
      return false;
    }
    
    // Return true to load other URLs
    return true;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading payment gateway...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: authorizationUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.loadingText}>Loading payment gateway...</Text>
          </View>
        )}
      />
      
      {/* Success Modal */}
      <PaymentSuccessModal visible={isModalVisible} onClose={closeModal} />
      
      {/* Custom Error Overlay */}
      {showErrorOverlay && (
        <View style={styles.errorOverlay}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Payment Issue</Text>
            <Text style={styles.errorMessage}>
              There was a problem processing your payment.
            </Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={() => {
                setShowErrorOverlay(false);
                router.back();
              }}
            >
              <Text style={styles.errorButtonText}>Return to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "KumbhSans_400Regular",
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: "KumbhSans_600SemiBold",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: "KumbhSans_400Regular",
  },
  errorButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  }
});