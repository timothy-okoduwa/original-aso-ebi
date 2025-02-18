/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import ButtomNav from "../components/ButtomNav";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import SearchComponent from "../components/SearchCompnent";
import FabricDataStore from "../components/FabricDataStore";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLocalSearchParams } from "expo-router";
import Categories from "../components/Categories";
import { Skeleton } from "../components/Spinner";

const BASE_URL = "https://oae-be.onrender.com/api/oae";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

export default function StoreResult() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { categoryId } = useLocalSearchParams();
  const [categoryName, setCategoryName] = useState("");

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategoryName();
  }, [categoryId]);

  const fetchCategoryName = async () => {
    try {
      const TOKEN = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/categories/all-categories`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const category = response.data.data.find((cat) => cat._id === categoryId);
      setCategoryName(category ? category.categoryName : "");
    } catch (err) {
      console.error("Error fetching category name:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/products/all-products`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      // Filter products by category
      const filteredProducts = response.data.data.filter(
        (product) => product.category === categoryId
      );

      // Transform the data to match FabricDataStore's expected format
      const transformedProducts = filteredProducts.map((product) => ({
        name: product.categoryTitle,
        price: `₦${product.price.toLocaleString()}`,
        image:
          product.image && product.image.length > 0
            ? { uri: product.image[0] }
            : null,
        favorite: false,
        _id: product._id,
        colors: product.colors,
        description: product.description,
        inStock: product.inStock,
        quantity: product.quantity,
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Store</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <SearchComponent setSearchQuery={setSearchQuery} />
          {loading ? (
            <View style={styles.loadingContainer}>
              <View style={styles.cardContainer}>
                {[1, 2, 3, 4].map((index) => (
                  <FabricSkeleton key={index} />
                ))}
              </View>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FabricDataStore
              activeCategory={categoryName}
              data={filteredProducts}
            />
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
  },
  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  errorText: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#F11515",
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  card: {
    marginBottom: 30,
    width: "48%",
    borderRadius: 10,
    marginTop: 90,
  },
  imageHolder: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  negetive: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 7,
  },
  titleContainer: {
    flex: 1,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
});
