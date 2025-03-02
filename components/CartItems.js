/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useMemo } from "react";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter } from "expo-router";
import {
  Octicons,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { CartContext } from "../app/CartContext";
import a from "../constants/image/oo.png";

const EmptyCart = () => (
  <View style={styles.emptyCart}>
    <View style={styles.circle}>
      <Ionicons name="cart-outline" size={74} color="#000000" />
    </View>
    <Text style={styles.emptyTitle}>Cart is Empty</Text>
    <Text style={styles.emptyDescription}>
      Once you add items to your cart, you'll find them displayed here.
    </Text>
  </View>
);

const CartItem = ({ item, onIncrement, onDecrement, onDelete }) => {
  const formatItemName = (categoryTitle) => {
    if (!categoryTitle) return "Untitled Item";
    return categoryTitle.replace(/-/g, " ");
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return "₦0.00";
    return `₦${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  // Ensure item exists and has required properties
  if (!item) return null;
  // Handle image source properly for both local and remote images
  const imageSource = () => {
    if (!item.image[0]) return a; // Default image

    // If the image is already a number (local require), use it directly
    if (typeof item.image[0] === "number") return item.image[0];

    // If it's a URI string, return an object with uri property
    if (typeof item.image[0] === "string") return { uri: item.image[0] };

    // Fallback to default image
    return a;
  };
  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imageSource()} resizeMode="cover" />
      </View>
      <View style={styles.itemDetails}>
        <View>
          <Text style={styles.itemName}>
            {formatItemName(item.categoryTitle)}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
          <Text style={styles.quantity}>Qty: {item.quantity} yards</Text>
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity style={styles.controlButton} onPress={onDecrement}>
            <Octicons name="dash" size={18} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.controlButton} onPress={onIncrement}>
            <Entypo name="plus" size={18} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <MaterialCommunityIcons
          name="delete-outline"
          size={24}
          color="#FB5D5D"
        />
      </TouchableOpacity>
    </View>
  );
};

export default function CartItems() {
  const router = useRouter();
  const {
    cartItems,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
  } = useContext(CartContext);

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const handleIncrement = (item) => {
    if (!item?.categoryTitle) return;
    // Always increment by 5
    const newQuantity = item.quantity + 5;
    updateItemQuantity(item.categoryTitle, newQuantity);
  };

  const handleDecrement = (item) => {
    if (!item?.categoryTitle) return;
    // Decrease by 5, but don't go below 5
    const newQuantity = Math.max(5, item.quantity - 5);
    updateItemQuantity(item.categoryTitle, newQuantity);
  };
  const handleCheckOut = () => {
    const totalAmount = getTotalAmount();
    const orderedItems = cartItems.map((item) => ({
      name: item.categoryTitle, // Use categoryTitle instead of name
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    router.push({
      pathname: "/checkout",
      params: {
        totalAmount,
        numberOfItems: cartItems.length,
        orderedItems: JSON.stringify(orderedItems),
      },
    });
  };

  const formattedTotal = useMemo(
    () =>
      `₦${getTotalAmount().toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
    [getTotalAmount, cartItems]
  );

  if (!fontsLoaded || fontError) {
    return <ActivityIndicator size="large" color="#000000" />;
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart Summary</Text>
      {cartItems.map((item, index) => (
        <CartItem
          key={index}
          item={item}
          onIncrement={() => handleIncrement(item)}
          onDecrement={() => handleDecrement(item)}
          onDelete={() => removeFromCart(item.categoryTitle)}
        />
      ))}
      <View style={styles.footer}>
        <Text style={styles.total}>Total: {formattedTotal}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckOut}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={clearCart}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: 30,
    fontFamily: "KumbhSans_400Regular",
    fontSize: 20,
    color: "#000000",
  },
  emptyCart: {
    flex: 1,
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
  emptyTitle: {
    marginTop: 20,
    fontFamily: "KumbhSans_500Medium",
    fontSize: 20,
    color: "#000000",
  },
  emptyDescription: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    marginTop: 10,
    width: 250,
    textAlign: "center",
  },
  itemContainer: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 3.12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    marginLeft: 20,
    flex: 1,
  },
  itemName: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    color: "#2E2E2E",
  },
  itemPrice: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    color: "#2E2E2E",
    marginTop: 10,
  },
  quantity: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 18,
    color: "#2E2E2E",
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 15,
  },
  controlButton: {
    width: 29,
    height: 26,
    borderRadius: 5,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  quantityText: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 13,
    color: "#000000",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: "#D2D2D233",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DCDCDC",
  },
  footer: {
    marginTop: 60,
  },
  total: {
    fontSize: 25,
    fontFamily: "KumbhSans_500Medium",
    color: "#000000",
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 50,
    gap: 15,
  },
  checkoutButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  clearButton: {
    width: "100%",
    height: 55,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#767676",
  },
  clearButtonText: {
    color: "#767676",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
});
