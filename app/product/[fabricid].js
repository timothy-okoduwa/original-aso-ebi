/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import DetailsImage from "../../components/DetailsImage";
import Colors from "../../components/Colors";
import { usePathname } from "expo-router";
import DetailsDescription from "../../components/DetailsDescription";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../../components/ButtomNav";
import axios from "axios";

const BASE_URL = "https://oae-be.onrender.com/api/oae";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

export default function detailspage() {
  const pathname = usePathname();
  const productId = pathname.split("/product/")[1];
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products
        const response = await axios.get(`${BASE_URL}/products/all-products`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });

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
  console.log(product);
  console.log(productId);
  console.log(pathname);
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator />
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
