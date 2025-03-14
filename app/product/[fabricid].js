/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import DetailsImage from "../../components/DetailsImage";
import Colors from "../../components/Colors";
import { usePathname } from "expo-router";
import DetailsDescription from "../../components/DetailsDescription";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../../components/ButtomNav";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://oae-be.onrender.com/api/oae";

export default function detailspage() {
  const pathname = usePathname();
  const productId = pathname.split("/product/")[1];
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const TOKEN = await AsyncStorage.getItem("token");
      try {
        setLoading(true);
        // Fetch all products
        const response = await axios.get(`${BASE_URL}/products/all-products`);

        // Find the specific product
        const foundProduct = response.data.data.find(
          (p) => p._id === productId
        );

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Show skeleton loading UI while data is loading
  if (loading) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <DetailsImage loading={true} />
            <View style={styles.main}>
              <Colors loading={true} />
              <DetailsDescription loading={true} />
            </View>
          </View>
        </ScrollView>
        <BottomNav />
        <StatusBar style="dark" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <DetailsImage product={product} />
          <View style={styles.main}>
            <Colors product={product} />
            <DetailsDescription product={product} />
          </View>
        </View>
      </ScrollView>
      <BottomNav />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  main: {
    padding: 15,
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});