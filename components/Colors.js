/** @format */

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import data from "./data";
export default function Colors({ product }) {
  if (product) {
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
    // If fabric is not found, render an appropriate message or fallback component
    return <Text>Fabric not found</Text>;
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
});
