/** @format */

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Skeleton } from "./Spinner"; // Update this path

export default function Colors({ product, loading = false }) {
  // Show skeleton while loading
  if (loading) {
    return (
      <View style={styles.main}>
        {/* Title skeleton */}
        <Skeleton width={60} height={20} />
        
        {/* Color blocks skeleton */}
        <View style={styles.cold}>
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              width={40}
              height={40}
              style={styles.colorBlockSkeleton}
            />
          ))}
        </View>
      </View>
    );
  }
  
  if (product && product.colors && product.colors.length > 0) {
    return (
      <View style={styles.main}>
        <Text>Colors</Text>
        <View style={styles.cold}>
          {product.colors.map((col, index) => (
            <View
              style={[styles.colorBlock, { backgroundColor: col }]}
              key={index}
            />
          ))}
        </View>
      </View>
    );
  } else {
    // If colors are not found, render an appropriate message or fallback component
    return <Text>Colors not available</Text>;
  }
}

const styles = StyleSheet.create({
  main: {
    marginTop: 10,
  },
  cold: {
    marginTop: 15,
    flexDirection: "row",
  },
  colorBlock: {
    backgroundColor: "#042D25",
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  colorBlockSkeleton: {
    borderRadius: 4,
    marginRight: 10,
  }
});