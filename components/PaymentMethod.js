import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  totalQuantity,
  orderDetails // Add this new prop
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [transactionRef, setTransactionRef] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const router = useRouter();
  const { addOrder } = useOrder();
  const { clearCart } = useContext(CartContext);

  // Fetch userId and token from AsyncStorage when component mounts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUserId && storedToken) {
          setUserId(storedUserId);
          setToken(storedToken);
        } else {
          Alert.alert("Error", "User data not found. Please login again.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
      }
    };
    
    getUserData();
  }, []);

  if (!fontsLoaded || fontError) {
    return null;
  }

  const initiateTransaction = async (selectedMethod) => {
    if (!userId || !token) {
      Alert.alert("Error", "User data not available. Please login again.");
      return null;
    }
    
    try {
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/payments/transaction/${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Number(totalAmount),
            orderQty: String(totalQuantity),
            paymentChannel: selectedMethod
          })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        // Store transaction reference and ID
        const ref = result.data.transactionData.reference;
        const id = result.data.createTransaction._id;
        
        console.log("Received transaction data:", { ref, id });
        
        // Set state variables
        setTransactionRef(ref);
        setTransactionId(id);
        
        // Return the URL for navigation
        return result.data.transactionData.authorization_url;
      } else {
        Alert.alert("Payment Error", result.message || "Failed to initiate payment");
        return null;
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
      Alert.alert("Error", "Failed to connect to payment service");
      return null;
    }
  };

  const updateTransactionStatus = async (reference) => {
    if (!userId || !token || !transactionId) {
      Alert.alert("Error", "Transaction data not available");
      return false;
    }
    
    try {
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/payments/transaction/${transactionId}/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reference: reference
          })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        Alert.alert("Update Error", result.message || "Failed to update transaction status");
        return false;
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert("Error", "Failed to update transaction status");
      return false;
    }
  };
  console.log("Order details received:", orderDetails);
  console.log("Ordered items:", orderedItems);

  const handlePaymentSelection = async (paymentType) => {
    setLoading(true);
    setSelectedMethod(paymentType);
    
    try {
      // Instead of calling initiateTransaction, put the logic directly here
      if (!userId || !token) {
        Alert.alert("Error", "User data not available. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/payments/transaction/${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Number(totalAmount),
            orderQty: String(totalQuantity),
            paymentChannel: paymentType
          })
        }
      );
      
      const result = await response.json();
      
      if (result.success) {
        // Get the transaction data directly from the response
        const authorizationUrl = result.data.transactionData.authorization_url;
        const reference = result.data.transactionData.reference;
        const transactionId = result.data.createTransaction._id;
        console.log(transactionId)
        // Log the data for debugging
        console.log("Transaction data before navigation:", {
          authorizationUrl: !!authorizationUrl,
          reference: !!reference,
          transactionId: !!transactionId
        });
        
        // Navigate with the local variables, not state variables
        router.push({
          pathname: "/paystackWebview",
          params: { 
            authorizationUrl,
            reference,
            transactionId,
            paymentType, 
            totalAmount, 
             orderedItems: JSON.stringify(orderedItems), 
            numberOfItems,
            totalQuantity,
            // Include complete order details if needed by the webview
            orderDetails: JSON.stringify(orderDetails)
          },
        });
      } else {
        Alert.alert("Payment Error", result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
      Alert.alert("Error", "Failed to connect to payment service");
    } finally {
      setLoading(false);
    }
  };

  const generateOrderId = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `#${randomNumber}`;
  };
  
  const orderId = generateOrderId();
  
  const payOnDelivery = () => {
    setLoading(true);
    setSelectedMethod("delivery");
    
    // No need to call API for pay-on-delivery, just create local order
    setTimeout(() => {
      addOrder({
        id: orderId,
        items: orderedItems,
        total: totalAmount,
        qty: totalQuantity,
        PaymentMethod: "delivery",
        date: new Date().toISOString(),
        // Include additional order details from Billing
        address: orderDetails?.address,
        phoneNumber: orderDetails?.phoneNumber,
        deliveryFee: orderDetails?.deliveryFee,
        serviceFee: orderDetails?.serviceFee
      });
      
      clearCart();
      setModalVisible(true);
      setLoading(false);
    }, 2000); // Reduced to 2 seconds for better UX
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handlePress = (paymentType) => {
    handlePaymentSelection(paymentType);
  };
console.log(orderedItems)
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
        {/* Payment options remain the same */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "card" && styles.disabledButton,
          ]}
          onPress={() => handlePress("card")}
          disabled={loading}
        >
          <View>
            <Text style={styles.plat}>Pay with Card</Text>
            <View style={styles.dealss}>
              <FontAwesome name="cc-visa" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "card" ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Remaining payment options... */}
        {/* Bank Transfer */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading &&
              selectedMethod === "bank_transfer" &&
              styles.disabledButton,
          ]}
          onPress={() => handlePress("bank_transfer")}
          disabled={loading}
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
            <ActivityIndicator size="small" color="black" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Bank */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "bank" && styles.disabledButton,
          ]}
          onPress={() => handlePress("bank")}
          disabled={loading}
        >
          <View>
            <Text style={styles.plat}>Bank</Text>
            <View style={styles.dealss}>
              <FontAwesome name="bank" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "bank" ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* USSD */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "ussd" && styles.disabledButton,
          ]}
          onPress={() => handlePress("ussd")}
          disabled={loading}
        >
          <View>
            <Text style={styles.plat}>USSD</Text>
            <View style={styles.dealss}>
              <Ionicons name="phone-portrait-sharp" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "ussd" ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* QR Code */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "qr" && styles.disabledButton,
          ]}
          onPress={() => handlePress("qr")}
          disabled={loading}
        >
          <View>
            <Text style={styles.plat}>QR Code</Text>
            <View style={styles.dealss}>
              <Ionicons name="qr-code-outline" size={18} color="black" />
            </View>
          </View>
          {loading && selectedMethod === "qr" ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <AntDesign name="right" size={24} color="black" />
          )}
        </TouchableOpacity>

        {/* Pay on Delivery */}
        <TouchableOpacity
          style={[
            styles.pettt,
            loading && selectedMethod === "delivery" && styles.disabledButton,
          ]}
          onPress={payOnDelivery}
          disabled={loading}
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
            <ActivityIndicator size="small" color="black" />
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
  // Styles remain the same
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
    opacity: 0.5,
  },
});