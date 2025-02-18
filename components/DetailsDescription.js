/** @format */

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { useFonts, Ledger_400Regular } from "@expo-google-fonts/ledger";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Octicons, Entypo } from "@expo/vector-icons";
import { CartContext } from "../app/CartContext";

export default function DetailsDescription({ product }) {
  const [quantity, setQuantity] = useState(5);
  const [added, setAdded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Ledger_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const { addToCart, cartItems, formatPrice } = useContext(CartContext);

  useEffect(() => {
    if (product && cartItems) {
      const isItemInCart = cartItems.some((item) => item._id === product._id);
      setAdded(isItemInCart);
    }
  }, [cartItems, product]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 5);
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => Math.max(5, prevQuantity - 5));
  };

  const calculateDisplayPrice = (basePrice, quantity) => {
    if (!basePrice) return "₦0";

    // Ensure basePrice is a number
    const price =
      typeof basePrice === "string"
        ? parseFloat(basePrice.replace(/[^0-9.]/g, ""))
        : basePrice;

    if (quantity === 5) {
      return formatPrice(price);
    } else {
      return formatPrice(price * (quantity / 5));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      ...product,
      quantity,
      basePrice: product.price, // Store original numeric price
    });
    setAdded(true);
  };

  if (fontError || !fontsLoaded) {
    return null;
  }

  if (!product) {
    return <Text>Product details not available</Text>;
  }

  return (
    <View style={styles.main}>
      <Text style={styles.fabname}>{product.name}</Text>
      <View>
        <Text style={styles.desc}>{product.description}</Text>
        <Text style={styles.price}>
          {calculateDisplayPrice(product.price, quantity)}
        </Text>
      </View>
      <View style={styles.nerd}>
        <Text style={styles.note}>
          Note: Price shown is for minimum quantity (5 yards). Price increases
          with additional yards.
        </Text>
      </View>
      <View style={styles.incc}>
        <TouchableOpacity
          style={[styles.incbut, quantity === 5 && styles.disabledButton]}
          onPress={handleDecrement}
          disabled={quantity === 5}
        >
          <Text style={styles.incone}>
            <Octicons
              name="dash"
              size={18}
              color={quantity === 5 ? "#CCCCCC" : "#000000"}
            />
          </Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.mount}>{quantity} yards</Text>
        </View>
        <TouchableOpacity style={styles.incbut} onPress={handleIncrement}>
          <Text style={styles.incone}>
            <Entypo name="plus" size={18} color="#000000" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addtoc}>
        <TouchableOpacity
          style={[styles.create, added && styles.added]}
          onPress={handleAddToCart}
          disabled={added}
        >
          <Text style={[styles.first, added && styles.sec]}>
            {added ? "Added to Cart" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 13,
  },
  fabname: {
    fontSize: 23,
    fontFamily: "Ledger_400Regular",
    marginTop: 6,
    lineHeight: 27,
  },
  desc: {
    marginTop: 13,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    color: "#000000",
  },
  price: {
    fontSize: 23,
    fontFamily: "Ledger_400Regular",
    marginTop: 20,
    lineHeight: 27,
    color: "#2E2E2E",
  },
  nerd: {
    marginTop: 30,
    height: 56,
    padding: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  note: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    lineHeight: 17,
    color: "#000000",
  },
  incc: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incbut: {
    width: 45,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
    borderColor: "#EAEAEA",
  },
  incone: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
  },
  mount: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
    color: "#000000",
  },
  addtoc: {
    marginTop: 30,
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
  added: {
    backgroundColor: "#ffffff",
    color: "#767676",
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
  },
});
