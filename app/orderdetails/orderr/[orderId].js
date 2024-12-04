/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter, useLocalSearchParams } from "expo-router";
import moment from "moment";
import BottomNav from "../../../components/ButtomNav";
import OrderDetails from "../../../components/OrderDetails";
import OrderDetailsForProgress from "../../../components/OrderDetailsForProgress";
import { useOrder } from "../../OrderContext";
export default function orderId() {
  const router = useRouter();
  const { orders } = useOrder(); // Fetch orders from context
  const { orderId } = useLocalSearchParams(); // Get orderId from URL
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // After 2 seconds stop refreshing
      setRefreshing(false);
    }, 2000);
  };
  const order = orders.find((order) => order.id === `#${orderId}`);
  console.log("orders", order);

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
          {/* <OrderDetails order={order} /> */}
          <OrderDetailsForProgress order={order} />
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0, // Adjust this value to accommodate the height of your ButtomNav component
    paddingTop: 100, // Add enough padding to the top to avoid overlap
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
    marginLeft: 30,
  },
  noteflex: {
    width: "100%",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 40,
  },
});
