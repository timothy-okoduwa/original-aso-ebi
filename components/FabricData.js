/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import a from "../constants/image/oo.png";

export default function FabricData({ activeCategory, initialData }) {
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  // Use state to manage data
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Update the data state whenever initialData changes
    setData(initialData);
  }, [initialData]);

  if (!fontsLoaded || fontError) {
    return null;
  }

  const noResults = data.length === 0;

  const toggleFavorite = (index) => {
    const updatedFabrics = [...data];
    updatedFabrics[index].favorite = !updatedFabrics[index].favorite;
    setData(updatedFabrics); // Correctly update state using setData
  };

  return (
    <View style={styles.container}>
      <Text style={styles.reliable}>{activeCategory}</Text>
      <View style={styles.pushdown}>
        <View style={styles.column}>
          {noResults ? (
            <Text style={styles.noResultsText}>No results found</Text>
          ) : (
            <View style={styles.cardContainer}>
              {data.map((fabric, index) => (
                <FabricCard
                  key={index}
                  fabric={fabric}
                  index={index}
                  toggleFavorite={() => toggleFavorite(index)} // Pass toggleFavorite function with index
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const FabricCard = ({ fabric, index, toggleFavorite }) => {
  const router = useRouter();

  const handleFavoriteToggle = () => {
    toggleFavorite(index);
  };

  const gotocreataccount = () => {
    router.push(`/${fabric.name}`);
  };

  return (
    <TouchableOpacity onPress={gotocreataccount} style={styles.card}>
      <View style={styles.imageHolder}>
        <Image
          style={styles.image}
          source={fabric.image || a}
          resizeMode="cover"
        />
      </View>
      <View style={styles.negetive}>
        <View>
          <Text style={styles.name}>{fabric.name.replace(/-/g, " ")}</Text>
        </View>
        <TouchableOpacity onPress={handleFavoriteToggle}>
          {fabric.favorite ? (
            <View style={styles.holi}>
              <Ionicons name="heart-outline" size={18} color="#F11515" />
            </View>
          ) : (
            <View style={styles.holi2}>
              <Ionicons name="heart-outline" size={18} color="black" />
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.price}>
          ₦{Number(fabric.price).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  reliable: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    lineHeight: 19,
    textAlign: "left",
    color: "#000000",
  },
  pushdown: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    marginLeft: 0, // Add margin between columns
  },
  cardContainer: {
    flexDirection: "row", // Display cards in a row
    flexWrap: "wrap", // Allow cards to wrap to the next line if necessary
    justifyContent: "space-between", // Space cards evenly within the container
  },
  holi: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F115151A",
    justifyContent: "center",
    alignItems: "center",
  },
  holi2: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 30, // Add margin between cards
    width: "48%", // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 10,
  },
  imageHolder: {
    height: 180, // Adjust card height as needed
    width: "100%", // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    flex: 1,
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
  noResultsText: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#FF0000", // Red color for indicating no results
  },
});
