/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ButtomNav from "../components/ButtomNav";
import { StatusBar } from "expo-status-bar";
import a from "../constants/image/oo.png";

import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Skeleton } from "../components/Spinner";
const BASE_URL = "https://oae-be.onrender.com/api/oae";
// const TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

export default function Favourite() {
  const router = useRouter();
  const [favorites, setFavorites] = useState({});
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadFavoritesAndProducts = async () => {
      const TOKEN = await AsyncStorage.getItem("token");
      try {
        setLoading(true);
        // Load favorites from AsyncStorage
        const storedFavorites = await AsyncStorage.getItem("favorites");
        const favoritesObj = storedFavorites ? JSON.parse(storedFavorites) : {};
        setFavorites(favoritesObj);

        // Fetch all products
        const response = await axios.get(`${BASE_URL}/products/all-products`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        // Filter products that are in favorites
        const favoriteProductsList = response.data.data.filter(
          (product) => favoritesObj[product._id]
        );
        setFavoriteProducts(favoriteProductsList);
      } catch (error) {
        console.error("Error loading favorites and products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoritesAndProducts();
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });
  const removeFavorite = async (productId) => {
    try {
      const newFavorites = { ...favorites };
      delete newFavorites[productId];
      setFavorites(newFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites));
      setFavoriteProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };
  if (!fontsLoaded || fontError) {
    return null;
  }
  const FabricSkeleton = () => {
    return (
      <View style={styles.card}>
        <Skeleton height={180} style={styles.imageHolder} />
        <View style={styles.negetive}>
          <View style={styles.titleContainer}>
            <Skeleton width="80%" height={19} style={{ marginTop: 7 }} />
            <View style={styles.colorsContainer}>
              {[1, 2, 3].map((_, index) => (
                <Skeleton
                  key={index}
                  width={12}
                  height={12}
                  style={[styles.colorDot, { marginRight: 4 }]}
                />
              ))}
            </View>
          </View>
          <Skeleton width={30} height={30} style={{ borderRadius: 15 }} />
        </View>
        <Skeleton width="40%" height={19} style={{ marginTop: 10 }} />
      </View>
    );
  };
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.storeview}>
          <Text style={styles.store}>Favorites</Text>
        </View>
        <View style={styles.pushdown}>
          <View style={styles.column}>
            <View style={styles.cardContainer}>
              {[1, 2, 3, 4].map((index) => (
                <FabricSkeleton key={index} />
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }
  const getStockStatus = (product) => {
    if (product.inStock === "false") {
      return {
        text: "Out of Stock",
        style: styles.outOfStockBadge,
        textStyle: styles.outOfStockText,
      };
    } else if (Number(product.quantity) < 50) {
      return {
        text: "Low Stock",
        style: styles.lowStockBadge,
        textStyle: styles.lowStockText,
      };
    } else if (product.inStock === "true" && Number(product.quantity) >= 50) {
      return {
        text: "Active",
        style: styles.activeBadge,
        textStyle: styles.activeText,
      };
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Favorites</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          {favoriteProducts.length === 0 ? (
            <View style={styles.cartt}>
              <View style={styles.circle}>
                <Feather name="heart" size={74} color="#000000" />
              </View>
              <Text style={styles.empty}>Favorites is Empty</Text>
              <Text style={styles.once}>
                Once you add items to your Favorites, you'll find them displayed
                here.
              </Text>
            </View>
          ) : (
            <View style={styles.cardContainer}>
              {favoriteProducts.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={styles.card}
                  onPress={() => router.push(`/product/${product._id}`)}
                >
                  <View style={styles.imageHolder}>
                    <Image
                      style={styles.image}
                      source={
                        product.image && product.image.length > 0
                          ? { uri: product.image[0] }
                          : a
                      }
                      resizeMode="cover"
                    />
                    {getStockStatus(product) && (
                      <View style={getStockStatus(product).style}>
                        <Text style={getStockStatus(product).textStyle}>
                          {getStockStatus(product).text}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.negetive}>
                    <Text style={styles.name}>{product.categoryTitle}</Text>
                    <TouchableOpacity
                      onPress={() => removeFavorite(product._id)}
                    >
                      <View style={styles.holi}>
                        <Ionicons name="heart" size={18} color="#F11515" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>
                    ₦{Number(product.price).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <ButtomNav />
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
  },
  holi: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F115151A",
    justifyContent: "center",
    alignItems: "center",
  },

  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 40,
  },
  pushdown: {
    marginTop: 140,
    marginBottom: 30,
  },
  select: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginLeft: 0,
  },
  card: {
    marginBottom: 60,
    width: "48%",
    borderRadius: 10,
  },
  imageHolder: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  imageText: {
    color: "white",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
  },
  negetive: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },
  name: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "left",
    color: "#000000",
  },
  price: {
    fontFamily: "KumbhSans_500Medium",
    fontSize: 17,
    lineHeight: 19,
    textAlign: "left",
    color: "#000000",
    marginTop: 10,
  },
  titleContainer: {
    flex: 1,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(241, 21, 21, 0.9)",
    padding: 5,
    borderRadius: 4,
  },
  outOfStockText: {
    color: "white",
    fontSize: 12,
    fontFamily: "KumbhSans_400Regular",
  },
  lowStockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 165, 0, 0.9)",
    padding: 5,
    borderRadius: 4,
  },
  lowStockText: {
    color: "white",
    fontSize: 12,
    fontFamily: "KumbhSans_400Regular",
  },
  activeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 128, 0, 0.9)",
    padding: 5,
    borderRadius: 4,
  },
  activeText: {
    color: "white",
    fontSize: 12,
    fontFamily: "KumbhSans_400Regular",
  },
});
