/** @format */

import React, { useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
import { useOrder } from "./OrderContext";
import { useContext } from "react";
import { CartContext } from "./CartContext";

import PaymentSuccessModal from "../components/PaymentSuccessModal";

export default function PaystackWebView() {
  const router = useRouter();
  const webViewRef = useRef(null);
  const { paymentType, totalAmount, orderedItems, numberOfItems } =
    useLocalSearchParams();
  const [isModalVisible, setModalVisible] = useState(false); // Modal state
  const { addOrder } = useOrder(); // Retrieve cart items from the context
  const { clearCart } = useContext(CartContext);
  // Convert totalAmount to kobo (1 NGN = 100 kobo)
  const amountInKobo = Math.round(parseFloat(totalAmount) * 100);

  // Function to handle messages sent back from WebView (Paystack responses)
  const handleWebViewMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("Payment Response:", data);

      if (data.type === "close") {
        console.log("Payment modal closed");
        router.back();
      } else if (data.status === "success") {
        console.log("Payment successful!");

        // Generate a unique ID for the order
        const generateOrderId = () => {
          const randomNumber = Math.floor(100000 + Math.random() * 900000);
          return `#${randomNumber}`;
        };
        const orderId = generateOrderId();

        // Add the order
        addOrder({
          id: orderId,
          items: orderedItems, // Use actual cart items
          total: totalAmount,
          qty: numberOfItems,
          PaymentMethod: paymentType,
          paymentResponse: data,
          date: new Date().toISOString(),
        });
        // Clear the cart
        clearCart();
        // Show the success modal
        setModalVisible(true);
        // Trigger a notification when payment is successful
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Order Status",
            body: `Your payment was successful! Your order ID is ${orderId}.`,
            sound: true,
          },
          trigger: null, // This means the notification will be shown immediately
        });

        console.log("Notification scheduled!");
      } else if (data.status === "failed") {
        console.log("Payment failed!");
        router.back();
      }
    } catch (error) {
      console.log("Error parsing message from WebView:", error);
      console.log("Raw message:", event.nativeEvent.data);
    }
  };

  // The HTML code for the Paystack Inline Payment
  const paystackHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Paystack Inline Payment</title>
      <script src="https://js.paystack.co/v1/inline.js"></script>
    </head>
    <body onload="payWithPaystack()">
      <script type="text/javascript">
        function payWithPaystack() {
          var handler = PaystackPop.setup({
            key: 'pk_test_89aaa353160cbf6c9c97b5efb14e4e0ff3f5f5eb', // Your Paystack Public Key
            email: 'timothyokoduwa7@gmail.com', // Replace with dynamic user email
            amount: ${amountInKobo}, // Amount in kobo
            currency: 'NGN',
            channels: ['${paymentType}'], // Selected payment channel (card, bank, ussd, etc.)
            ref: '' + Math.floor(Math.random() * 1000000000 + 1), // Generate unique transaction reference
            callback: function(response) {
              console.log('Payment was successful:', response);
              window.ReactNativeWebView.postMessage(JSON.stringify(response)); // Send payment success to React Native
            },
            onClose: function() {
              console.log('Payment was cancelled.');
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'close' })); // Send close event to React Native
            }
          });
          handler.openIframe();
        }
      </script>
    </body>
    </html>
  `;

  // Close modal function
  const closeModal = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: paystackHTML }} // Pass the HTML string with the correct payment type
        javaScriptEnabled={true}
        onMessage={handleWebViewMessage} // Capture Paystack's response and close event
      />

      <PaymentSuccessModal visible={isModalVisible} onClose={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    backgroundColor: "#E9F7EF",
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: "#28a745",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
