import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator
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
import { useLocalSearchParams } from "expo-router";

const BASE_URL = "https://oae-be.onrender.com/api/oae";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

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
      const response = await axios.get(`${BASE_URL}/categories/all-categories`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const category = response.data.data.find(cat => cat._id === categoryId);
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
        product => product.category === categoryId
      );
      
      // Transform the data to match FabricDataStore's expected format
      const transformedProducts = filteredProducts.map(product => ({
        name: product.categoryTitle,
        price: `₦${product.price.toLocaleString()}`,
        image: product.image && product.image.length > 0 
          ? { uri: product.image[0] }
          : null,
        favorite: false,
        _id: product._id,
        colors: product.colors,
        description: product.description,
        inStock: product.inStock,
        quantity: product.quantity
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
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!fontsLoaded || fontError) {
    return null;
  }

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
              <ActivityIndicator size="large" color="#000000" />
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
  }
});