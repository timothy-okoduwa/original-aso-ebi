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
import Icon from "react-native-vector-icons/MaterialIcons"; // Install this using `npm install react-native-vector-icons`

import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import a from "../constants/image/sen2.png";
import { useRouter } from "expo-router";

export default function OrderDetailsForProgress() {
  const [lineHeight, setLineHeight] = useState(0);
  const steps = [
    {
      title: "Confirm Order",
      description: "Your order has been confirmed.",
      completed: true,
    },
    {
      title: "Preparing Order",
      description: "Your order is being prepared.",
      completed: true,
    },
    {
      title: "Shipped",
      description: "Your order has been given to our rider.",
      completed: true,
    },
    {
      title: "In Transit",
      description: "Your order is en route to you.",
      completed: false,
    },
    {
      title: "Package is here!",
      description: "Yay! Your package is here.",
      completed: false,
    },
  ];

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setLineHeight(height + 20); // Adding a bit of padding for spacing
  };

  const router = useRouter();
  const move = () => {
    router.push("/orderdetails/ordernumber");
  };
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  return (
    <View style={styles.pushmain}>
      <TouchableOpacity style={styles.holderr} onPress={move}>
        <View>
          <View style={styles.imageHolder}>
            <Image style={styles.image} source={a} resizeMode="cover" />
          </View>
        </View>
        <View style={styles.prices}>
          <View>
            <View>
              <Text style={styles.namez}>#11242209</Text>
            </View>
            <View>
              <Text style={styles.amont}>₦ 200,000</Text>
            </View>
          </View>
          <View style={styles.pills}>
            <Text style={styles.cnf}>Shipped</Text>
          </View>
        </View>
      </TouchableOpacity>

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
            <View key={index} style={styles.stepContainer}>
              {/* Left Icon + Line */}
              <View style={styles.iconWrapper}>
                <Icon
                  name={
                    step.completed ? "check-circle" : "radio-button-unchecked"
                  }
                  size={24}
                  color={step.completed ? "green" : "gray"}
                />
                {index < steps.length - 1 && <View style={styles.dashedLine} />}
              </View>
              {/* Text Content */}
              <View style={styles.textWrapper}>
                <Text
                  style={[styles.title, step.completed && styles.completedText]}
                >
                  {step.title}
                </Text>
                <Text style={styles.description}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.addview}>
          <View style={styles.center}>
            <View style={styles.dott}></View>
            <View style={[styles.linee, { height: lineHeight }]}></View>
            <FontAwesome6 name="location-dot" size={10} color="black" />
          </View>
          <View style={{ gap: 15 }}>
            <View style={styles.colasp} onLayout={handleLayout}>
              <View>
                <View style={{ width: "77%" }}>
                  <Text style={styles.addyName}>
                    Idera oluwa stores, 123b idumota market, Lagos
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.addyTime}>5:20pm</Text>
                </View>
              </View>
              <View>
                <Text>Sat, 2nd Nov, 2024</Text>
              </View>
            </View>
            <View style={styles.colasp} onLayout={handleLayout}>
              <View>
                <View style={{ width: "77%" }}>
                  <Text style={styles.addyName}>
                    117, Adeladun Street, via Onado Bus-stop, Magodo, Lagos
                  </Text>
                </View>
                <View style={{ marginTop: 5 }}>
                  <Text style={styles.addyTime}>6:30pm</Text>
                </View>
              </View>
              <View>
                <View style={{ marginTop: 5 }}>
                  <View style={styles.pills}>
                    <Text style={styles.cnf}>Shipped</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={styles.fki2}>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Royal Blue Lace</Text>
            </View>
            <View>
              <Text style={styles.shish2}>5 yards ( ₦ 20,000.00 )</Text>
            </View>
          </View>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Shifon Caracade</Text>
            </View>
            <View>
              <Text style={styles.shish2}>5 yards ( ₦ 100,000.00 )</Text>
            </View>
          </View>

          <View style={styles.sponner2}>
            <View>
              <Text style={styles.shish2}>Sub-total (2 items)</Text>
            </View>
            <View>
              <Text style={styles.shish2}>₦ 120,000.00</Text>
            </View>
          </View>
        </View>
        <View>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Delivery Fee</Text>
            </View>
            <View>
              <Text style={styles.shish2}>₦5,000.00</Text>
            </View>
          </View>
          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish2}>Service Fee</Text>
            </View>
            <View>
              <Text style={styles.shish2}>₦200</Text>
            </View>
          </View>

          <View style={styles.sponner}>
            <View>
              <Text style={styles.shish3}>Total</Text>
            </View>
            <View>
              <Text style={styles.shish3}>₦ 124,200.00</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={styles.pettt} // Disable the button when loading
      >
        <View>
          <Text style={styles.plat}>Pay on Delivery</Text>
          <View style={styles.dealss}>
            <Text style={styles.pori}>Pay with cash</Text>
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
    gap: 20,
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
    backgroundColor: "#F79E1B",
    borderRadius: 4,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 12,
    marginTop: 10,
  },

  cnf: {
    color: "#FFFFFF",
  },
});
