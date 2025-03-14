/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router"; // Import useRouter
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { useOrder } from "../app/contexts/OrderContext";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useContext } from "react";
import { CartContext } from "../app/contexts/CartContext";
export default function PaymentMethod({
  totalAmount,
  numberOfItems,
  orderedItems,
}) {
  const [isModalVisible, setModalVisible] = useState(false); // Modal state
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedMethod, setSelectedMethod] = useState(null); // Track selected method
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const router = useRouter(); // Initialize the router
  const { addOrder } = useOrder();
  const { clearCart } = useContext(CartContext);

  if (!fontsLoaded || fontError) {
    return null;
  }

  const handlePaymentSelection = (paymentType) => {
    setTimeout(() => {
      router.push({
        pathname: "/paystackWebview", // Your WebView route
        params: { paymentType, totalAmount, orderedItems, numberOfItems }, // Pass the paymentType to the next page
      });
      setLoading(false); // Stop loading after navigation
    }, 5000); // 5 seconds delay
  };
  const generateOrderId = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `#${randomNumber}`;
  };
  const orderId = generateOrderId();
  const payOnDelivery = () => {
    setLoading(true); // Start loading
    setSelectedMethod("delivery"); // Track selected method
    setTimeout(() => {
      setModalVisible(true); // Show the modal after 5 seconds
      setLoading(false); // Stop loading
    }, 5000);
    addOrder({
      id: orderId,
      items: orderedItems, // Use actual cart items
      total: totalAmount,
      qty: numberOfItems,
      PaymentMethod: "delivery",
      date: new Date().toISOString(),
    });
    // Clear the cart
    clearCart();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handlePress = (paymentType) => {
    setLoading(true); // Start loading
    setSelectedMethod(paymentType); // Track selected method
    handlePaymentSelection(paymentType); // Delay before handling payment selection
  };

  return (
    <View>
      <View style={styles.mainn}>
        <Text style={styles.store}>Select payment method</Text>
        <View>
          <Text style={styles.store2}>
            You will be paying a total of ₦
            {Number(totalAmount).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
      </View>

      <View style={styles.pushh}>
        {/* Pay with Card */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "card" && styles.disabledButton,
          ]} // Disable the button when loading
          onPress={() => handlePress("card")}
          disabled={loading && selectedMethod === "card"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>Pay with Card</Text>
            <View style={styles.dealss}>
              <FontAwesome name="cc-visa" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "card" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Bank Transfer */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading &&
              selectedMethod === "bank_transfer" &&
              styles.disabledButton,
          ]} // Disable the button when loading
          onPress={() => handlePress("bank_transfer")}
          disabled={loading && selectedMethod === "bank_transfer"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>Bank Transfer</Text>
            <View style={styles.dealss}>
              <MaterialCommunityIcons
                name="bank-transfer"
                size={24}
                color="black"
              />
            </View>
          </View>
          {loading && selectedMethod === "bank_transfer" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Bank */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "bank" && styles.disabledButton,
          ]} // Disable the button when loading
          onPress={() => handlePress("bank")}
          disabled={loading && selectedMethod === "bank"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>Bank</Text>
            <View style={styles.dealss}>
              <FontAwesome name="bank" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "bank" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* USSD */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "ussd" && styles.disabledButton,
          ]} // Disable the button when loading
          onPress={() => handlePress("ussd")}
          disabled={loading && selectedMethod === "ussd"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>USSD</Text>
            <View style={styles.dealss}>
              <Ionicons name="phone-portrait-sharp" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "ussd" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* QR Code */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "qr" && styles.disabledButton,
          ]} // Disable the button when loading
          onPress={() => handlePress("qr")}
          disabled={loading && selectedMethod === "qr"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>QR Code</Text>
            <View style={styles.dealss}>
              <Ionicons name="qr-code-outline" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "qr" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Pay on Delivery */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "delivery" && styles.disabledButton,
          ]} // Disable the button when loading
          onPress={payOnDelivery}
          disabled={loading && selectedMethod === "delivery"} // Disable the button while loading
        >
          <View>
            <Text style={styles.plat}>Pay on Delivery</Text>
            <View style={styles.dealss}>
              <Text style={styles.pori}>
                Pay with cash when your order arrives
              </Text>
            </View>
          </View>
          {loading && selectedMethod === "delivery" ? (
            <ActivityIndicator size="small" color="black" /> // Show loader while waiting
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
      <PaymentSuccessModal visible={isModalVisible} onClose={closeModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 20,
  },
  store2: {
    fontFamily: "KumbhSans_500Medium",
    color: "#000000",
    fontSize: 16,
    marginTop: 20,
  },
  mainn: {
    flex: 1,
  },
  pushh: {
    marginTop: 40,
  },
  pettt: {
    width: "100%",
    padding: 17,
    borderRadius: 16,
    borderColor: "#E9E9E9",
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  plat: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "KumbhSans_500Medium",
  },
  dealss: {
    flexDirection: "row",
    marginTop: 10,
  },
  pori: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.5, // Make the button appear disabled
  },
});
