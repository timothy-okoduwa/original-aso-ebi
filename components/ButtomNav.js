/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, usePathname, useRouter } from "expo-router";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { CartContext } from "../app/contexts/CartContext";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartItems } = useContext(CartContext);

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const mainhome = () => {
    router.push("/mainhome");
  };
  const shop = () => {
    router.push("/shop");
  };
  const cart = () => {
    router.push("/cart");
  };
  const order = () => {
    router.push("/order");
  };
  const settings = () => {
    router.push("/settings");
  };

  const isCartPopulated = cartItems.length > 0;

  return (
    <View style={styles.main}>
      <View style={styles.flexes}>
        <View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={mainhome}
          >
            <View>
              <AntDesign
                name="home"
                size={24}
                color={pathname === "/mainhome" ? "#000000" : "#b3b3b3"}
              />
            </View>
            <Text
              style={{
                color: pathname === "/mainhome" ? "#000000" : "#b3b3b3",
              }}
            >
              Home
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={shop}
          >
            <View>
              <Feather
                name="shopping-bag"
                size={24}
                color={
                  pathname === "/shop" || pathname === "/storeresult"
                    ? "#000000"
                    : "#b3b3b3"
                }
              />
            </View>
            <Text
              style={{
                color:
                  pathname === "/shop" || pathname === "/storeresult"
                    ? "#000000"
                    : "#b3b3b3",
              }}
            >
              Shop
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={cart}
          >
            <View>
              <Ionicons
                name="cart-outline"
                size={24}
                color={pathname === "/cart" ? "#000000" : "#b3b3b3"}
              />
              {isCartPopulated && (
                <View style={styles.dotContainer}>
                  <View style={styles.redDot} />
                </View>
              )}
            </View>
            <Text
              style={{ color: pathname === "/cart" ? "#000000" : "#b3b3b3" }}
            >
              Cart
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={order}
          >
            <View>
              <FontAwesome6
                name="box-open"
                size={24}
                color={
                  pathname === "/order" ||
                  pathname === "/orderdetails/ordernumber"
                    ? "#000000"
                    : "#b3b3b3"
                }
              />
            </View>
            <Text
              style={{
                color:
                  pathname === "/order" ||
                  pathname === "/orderdetails/ordernumber"
                    ? "#000000"
                    : "#b3b3b3",
              }}
            >
              Order
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={settings}
          >
            <View>
              <Ionicons
                name="settings-outline"
                size={24}
                color={pathname === "/settings" ? "#000000" : "#b3b3b3"}
              />
            </View>
            <Text
              style={{
                color: pathname === "/settings" ? "#000000" : "#b3b3b3",
              }}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "offwhite",
    height: 66,
   
  },
  flexes: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    justifyContent: "space-around",
  },
  labels: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
    color: "#000000",
    marginTop: 15,
  },
  dotContainer: {
    position: "absolute",
    top: -1,
    right: -1,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F11515",
  },
});
