import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import a from "../constants/image/sen2.png";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnGoingOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const moveToOrderDetails = (orderId) => {
    const sanitizedOrderId = orderId
    console.log("orderid:", sanitizedOrderId)
    router.push(`/orderdetails/orderr/${sanitizedOrderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get userId and token from AsyncStorage
      const userId = await AsyncStorage.getItem("userId");
      const token = await AsyncStorage.getItem("token");

      if (!userId || !token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      // Make API request
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
      
      // Filter out orders with "delivered" status
      const filteredOrders = result.data.orders.filter(
        order => order.orderStatus.toLowerCase() !== "delivered"
      );
      
      setOrders(filteredOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return styles.pills;
      case "shipped":
        return styles.pillsShipped;
      case "pending":
        return styles.pillsPending;
      case "processing":
        return styles.processingPills;
      case "delivered":
        return styles.pillsDelivered;
      case "cancelled":
        return styles.pillsCancled;
      default:
        return styles.pills;
    }
  };

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={styles.emptyText}>Loading orders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error loading orders: {error}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.cartt}>
        <View style={styles.circle}>
          <Text style={styles.cartc}>🛒</Text>
        </View>
        <Text style={styles.empty}>No Orders Yet</Text>
        <Text style={styles.once}>Once you place an order, it will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {orders.map((order) => (
        <TouchableOpacity
          key={order._id}
          style={styles.holderr}
          onPress={() => moveToOrderDetails(order.orderid)}
        >
          <View>
            <View style={styles.imageHolder}>
              <Image 
                style={styles.image}  
                source={
                  order.items[0]?.image && 
                  order.items[0].image.length > 0 
                    ? { uri: order.items[0].image[0] } 
                    : a // fallback image
                }  
                resizeMode="cover" 
              />
            </View>
          </View>
          <View style={styles.prices}>
            <View>
              <View>
                <Text style={styles.namez}>Order ID: {order.orderid}</Text>
              </View>
              <View>
                <Text style={styles.amont}>₦ {order.totalAmount.toLocaleString()}</Text>
              </View>
              <View>
                <Text style={styles.qty}>Qty: {order.totalQty} item(s)</Text>
              </View>
            </View>
            <View style={getStatusStyle(order.orderStatus)}>
              <Text style={styles.cnf}>{order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    fontFamily: "KumbhSans_400Regular",
    marginTop: 10,
  },
  pop: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  total: {
    fontSize: 25,
    fontFamily: "KumbhSans_500Medium",
    color: "#000000",
  },
  added: {
    width: "100%",
    height: 55,
    backgroundColor: "#ffffff",
    color: "#767676",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1, 
    borderColor: "#767676", 
  },
  first: {
    color: "white",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  sec: {
    color: "#767676",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  create: {
    fontFamily: "KumbhSans_500Medium",
    width: "100%",
    height: 55,
    backgroundColor: "#000000",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  flux: {
    backgroundColor: "white",
    marginTop: 50,
  },
  summary: {
    marginTop: 30,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 20,
    lineHeight: 19,
    textAlign: "left",
    color: "#000000",
  },
  holderr: {
    flexDirection: "row",
    marginBottom: 30,
  },
  imageHolder: {
    height: 100,
    width: 100,
    borderRadius: 3.12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    flex: 1,
  },
  prices: {
    marginLeft: 20,
    width: "70%",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  namez: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: "left",
    color: "#2E2E2E",
  },
  amont: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: "left",
    color: "#2E2E2E",
    marginTop: 10,
  },
  qty: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: "left",
    color: "#2E2E2E",
    marginTop: 10,
  },
  counter: {
    width: 160,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  incone: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
  },
  incbut: {
    width: 29,
    height: 26,
    borderRadius: 5,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  gaddle: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: "#D2D2D233",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  mount: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 13,
    color: "#000000",
  },
  delete: {
    flex: 1,
    alignItems: "flex-end",
  },
  cartt: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 146,
    height: 146,
    backgroundColor: "#F9F9F9",
    borderRadius: 73,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    marginTop: 20,
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
    color: "#000000",
  },
  once: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    marginTop: 10,
    width: 250,
    textAlign: "center",
  },
  pills: {
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3F70CF",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  pillsShipped: {
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F79E1B",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  pillsPending: {
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFB020",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  pillsDelivered: {
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#14B8A6",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  processingPills:{
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  pillsCancled:{
    width: 90,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1451B",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },
  cnf: {
    color: "#FFFFFF",
  },
  cartc:{
    fontSize:90
      },
});