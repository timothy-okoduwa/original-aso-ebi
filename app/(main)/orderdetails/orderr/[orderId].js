import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNav from "../../../../components/ButtomNav";
import OrderDetailsForProgress from "../../../../components/OrderDetailsForProgress";

export default function OrderId() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      // Get userId and token from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");
  
      if (!userId || !token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
  
      console.log("Looking for orderId:", orderId);
  
      // Make API request to get all orders for the user
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/orders/orders/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const result = await response.json();
      
      // Better logging to see the structure and orderIds
      console.log("Orders count:", result.data.orders.length);
      result.data.orders.forEach((order, index) => {
        console.log(`Order ${index} ID:`, order.orderid);
      });
      
      // Check if we have orders in the response
      if (result.data && result.data.orders && result.data.orders.length > 0) {
        // Find the specific order that matches the orderId from URL params
        const foundOrder = result.data.orders.find(order => order.orderid === orderId);
        
        if (foundOrder) {
          console.log("Found matching order:", foundOrder.orderid);
          setOrder(foundOrder);
        } else {
          console.log("No matching order found for ID:", orderId);
          setError(`Order with ID ${orderId} not found`);
        }
      } else {
        setError("No orders found");
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (!fontsLoaded || fontError) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchOrderDetails}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <View style={styles.movearrow}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.noteflex}>
          <Text style={styles.store}>Order Details</Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <OrderDetailsForProgress 
            order={{
              id: order.orderid,
              totalAmount: order.totalAmount,
              createdAt: order.createdAt,
              paymentMethod: order.paymentMethod,
              items: order.items,
              transactionRef:order.transactionRef,
              deliveryFee: order.deliveryFee,
              serviceFee: order.serviceFee,
              paymentResponse: order.paymentResponse || {}
            }} 
            deliveryAddress={order.deliveryAddress}
            orderStatus={order.orderStatus}
          />
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontFamily: "KumbhSans_500Medium",
    fontSize: 16,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0,
    paddingTop: 100,
  },
  main: {
    padding: 15,
    flex: 1,
  },
  storeview: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: "white",
    padding: 15,
    paddingTop: 45,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  movearrow: {
    position: "absolute",
    left: 15,
    top: 45,
  },
  noteflex: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  store: {
    fontFamily: "KumbhSans_500Medium",
    color: "#000000",
    fontSize: 20,
  },
});