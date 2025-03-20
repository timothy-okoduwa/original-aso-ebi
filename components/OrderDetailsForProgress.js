/** @format */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import a from "../constants/image/sen2.png";
import { useRouter } from "expo-router";

export default function OrderDetailsForProgress({ order, deliveryAddress, orderStatus }) {
  // Destructure order object for easier access
  const { id, totalAmount, createdAt, paymentMethod, items, deliveryFee, serviceFee,transactionRef } = order;
  
  const [lineHeight, setLineHeight] = useState(0);
  
  // Define order statuses and their progression order
  const statusOrder = ["pending", "confirmed", "processing", "shipped", "delivered"];
  
  // Find the current status index
  const currentStatusIndex = statusOrder.findIndex(
    status => status.toLowerCase() === orderStatus?.toLowerCase()
  );
  
  // Define the steps for order progress tracking with dynamic completion status
  const steps = [
    {
      title: "Pending Order",
      description: "Got your order! Just waiting to be processed. ⏳",
      completed: currentStatusIndex >= 0,
    },
    {
      title: "Confirm Order",
      description: "Your order is confirmed! We’re on it. ✅",
      completed: currentStatusIndex >= 1,
    },
    {
      title: "Processing Order",
      description: "We’re prepping your order. Almost there! 🔄",
      completed: currentStatusIndex >= 2,
    },
    {
      title: "Shipped",
      description: "Your order is on the move! 🚚",
      completed: currentStatusIndex >= 3,
    },
    {
      title: "Delivered",
      description: "It’s here! Hope you love it. 🎉",
      completed: currentStatusIndex >= 4,
    },
  ];
  

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setLineHeight(height + 20); // Adding a bit of padding for spacing
  };

  const router = useRouter();
  
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  
  // Calculate total sub-total (no need to parse items since we're passing the actual object)
  const subTotal = Array.isArray(items) 
    ? items.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
    : 0;
  
  // Use provided fees or default to 0 if not available
  const orderDeliveryFee = deliveryFee || 0;
  const orderServiceFee = serviceFee || 0;
  
  // Fixed getStatusStyle function
  const getStatusStyle = (status) => {
    if (!status) return styles.pills;
    
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
  const paymentText = `You paid with ${paymentMethod ? `${paymentMethod} via Paystack` : "Delivery"}.`;

  return (
    <View style={styles.pushmain}>
      {/* Order ID and amount section */}
      <View style={styles.holderr}>
        <View>
          <View style={styles.imageHolder}>
            <Image style={styles.image} source={
                            items[0]?.image && 
                            items[0].image.length > 0 
                              ? { uri: items[0].image[0] } 
                              : a // fallback image
                          } resizeMode="cover" />
          </View>
        </View>
        <View style={styles.prices}>
          <View>
            <View>
              <Text style={styles.namez}>{id}</Text>
            </View>
            <View>
              <Text style={styles.amont}>
                ₦ {totalAmount?.toLocaleString() || '0'}
              </Text>
            </View>
          </View>
          <View style={getStatusStyle(orderStatus)}>
            <Text style={styles.cnf}>{orderStatus}</Text>
          </View>
        </View>
      </View>

      {/* Tracking and progress section */}
      <View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.shish3}>Track Order</Text>
        </View>
        <View style={{ marginTop: 15, marginBottom: 30 }}>
          <Text style={styles.addyName}>
            Monitor the progress of your delivery here.
          </Text>
        </View>
        <View style={{ marginTop: 9, marginBottom: 30 }}>
          <Text style={styles.header}>Order Progress</Text>

          {steps.map((step, index) => (
            <View 
              key={index} 
              style={[
                styles.stepContainer,
                !step.completed && !step.active && { opacity: 0.4 } // Apply opacity to incomplete steps
              ]}
            >
              {/* Left Icon + Line */}
              <View style={styles.iconWrapper}>
                <Icon
                  name={
                    step.completed ? "check-circle" : "radio-button-unchecked"
                  }
                  size={24}
                  color={step.completed ? "green" : step.active ? "blue" : "gray"}
                />
                {index < steps.length - 1 && (
                  <View 
                    style={[
                      styles.dashedLine,
                      !step.completed && { borderColor: "#d0d0d0" } // Lighter border for incomplete steps
                    ]} 
                  />
                )}
              </View>
              {/* Text Content */}
              <View style={styles.textWrapper}>
                <Text
                  style={[
                    styles.title, 
                    step.completed && styles.completedText,
                    step.active && styles.activeText,
                    !step.completed && !step.active && styles.incompleteText
                  ]}
                >
                  {step.title}
                </Text>
                <Text 
                  style={[
                    styles.description,
                    !step.completed && !step.active && styles.incompleteText
                  ]}
                >
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Delivery addresses section */}
        <View style={styles.addview}>
          <View style={styles.center}>
            <View style={styles.dott}></View>
            <View style={[styles.linee, { height: lineHeight }]}></View>
            <FontAwesome6 name="location-dot" size={10} color="black" />
          </View>
          <View style={{ gap: 15 }}>
            <View style={styles.colasp} onLayout={handleLayout}>
              <View>
                <View style={{ width: "70%" }}>
                  <Text style={styles.addyName}>
                    Idera oluwa stores, 123b idumota market, Lagos
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.addyTime}>
                    {moment(createdAt).format("h:mma")}
                  </Text>
                </View>
              </View>
              <View>
                <Text>{moment(createdAt).format("ddd, Do MMM, YYYY")}</Text>
              </View>
            </View>
            <View style={styles.colasp} onLayout={handleLayout}>
              <View>
                <View style={{ width: "73%" }}>
                  <Text style={styles.addyName}>
                    {deliveryAddress}
                  </Text>
                </View>
              </View>
              <View>
                <View style={{ marginTop: 5 }}>
                  <View style={getStatusStyle(orderStatus)}>
                    <Text style={styles.cnf}>{orderStatus}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      {/* Order items and pricing breakdown */}
      <View>
        <View style={styles.fki2}>
          {Array.isArray(items) && items.map((item, index) => (
            <View key={index} style={styles.sponner}>
              <View>
                <Text style={styles.shish2}>{item.name}</Text>
              </View>
              <View>
                <Text style={styles.shish2}>
                  {item.quantity} {item.quantity > 1 ? "yards" : "yard"} ( ₦{" "}
                  {item.price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  }) || '0.00'}{" "}
                  )
                </Text>
              </View>
            </View>
          ))}

          {/* <View style={styles.sponner2}>
            <View>
              <Text style={styles.shish2}>
                Sub-total ({items?.length || 0} {(items?.length || 0) > 1 ? "items" : "item"})
              </Text>
            </View>
            <View>
              <Text style={styles.shish2}>₦ {subTotal?.toLocaleString() || '0'}</Text>
            </View>
          </View> */}
        </View>
        <View>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Delivery Fee</Text>
            </View>
            <View>
              <Text style={styles.shish2}>
                ₦{" "}
                {orderDeliveryFee?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || '0.00'}
              </Text>
            </View>
          </View>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Service Fee</Text>
            </View>
            <View>
              <Text style={styles.shish2}>
                ₦{" "}
                {orderServiceFee?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) || '0.00'}
              </Text>
            </View>
          </View>

          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish3}>Total</Text>
            </View>
            <View>
              <Text style={styles.shish3}>
                ₦{" "}
                {totalAmount?.toLocaleString(undefined, { 
                  minimumFractionDigits: 2 
                }) || '0.00'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Payment method section */}
      <View style={styles.pettt}>
        <View>
          <Text style={styles.plat}>
            Paid with {paymentMethod || "Delivery"}
          </Text>
          <View style={styles.dealss}>
            <Text style={styles.pori}>
           {paymentText}
            </Text>
          </View>
          <View style={styles.dealss}>
            <Text style={styles.pori}>
           Transaction Reference: {transactionRef}
            </Text>
          </View>
          
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 33,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    // marginBottom: 50,
    gap: 20,
  },
  iconWrapper: {
    alignItems: "center",
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
    paddingBottom: 16,
  },
  dashedLine: {
    width: 1, // Line thickness
    height: 50, // Line height
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
    marginTop: 4,
    marginBottom: 4,
  },
  iconContainer: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    color: "#121212",
    fontFamily: "KumbhSans_500Medium",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#444444",
    fontFamily: "KumbhSans_400Regular",
  },
  completedText: {
    color: "green",
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
    marginTop: 40,
  },
  shish2: { color: "#444444", fontSize: 16, fontFamily: "KumbhSans_500Medium" },
  shish3: { color: "#000000", fontSize: 20, fontFamily: "KumbhSans_500Medium" },
  fki2: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginBottom: 17,
    marginTop: 17,
  },
  sponner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  sponner2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  consup: {
    backgroundColor: "#F7F7F7",
    padding: 9,
    borderRadius: 6,
  },
  contsup: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    lineHeight: 20,
    textAlign: "left",
    color: "#444444",
  },
  vot: {
    fontSize: 21,
    fontFamily: "KumbhSans_500Medium",
    lineHeight: 21,
    color: "#000000",
  },
  odtimline: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    marginTop: 60,
  },
  addyTime: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
    color: "#444444",
  },
  addyName: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 17,
    lineHeight: 20,
    textAlign: "left",
    color: "#444444",
  },
  colasp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
  },
  linee: {
    backgroundColor: "#6B6B6B",
    width: 1,
  },
  dott: {
    width: 10,
    height: 10,
    borderRadius: 30,
    backgroundColor: "#9A9A9A",
  },
  addview: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },
  pushmain: {
    marginTop: 30,
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

    borderWidth: 1, // Add border width
    borderColor: "#767676", // Add border color
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
    // backgroundColor: 'green',
    flexDirection: "row",
    // justifyContent: 'space-between',
    marginBottom: 30,
  },
  imageHolder: {
    height: 100, // Adjust card height as needed
    width: 100, // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 3.12,
    overflow: "hidden",
    // backgroundColor: 'red',
  },
  image: {
    width: "100%",
    flex: 1,
  },
  prices: {
    marginLeft: 20,
    width: "40%",
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
    marginTop: 20,
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
    borderWidth: 1, // Add border width
    borderColor: "#DCDCDC", // Add border color
  },
  gaddle: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: "#D2D2D233",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Add border width
    borderColor: "#DCDCDC", // Add border color
  },
  mount: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 13,
    color: "#000000",
  },
  delete: {
    // marginLeft: 80,
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

  cnf: {
    color: "#FFFFFF",
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
  incompleteText: {
    color: '#a0a0a0', // Light gray color for incomplete steps
  },
  activeText: {
    color: '#0066cc', // Blue color for the active step
    fontWeight: '500',
  },
  completedText: {
    color: '#006400', // Dark green for completed steps
    fontWeight: '500',
  },
});