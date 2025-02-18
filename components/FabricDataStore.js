/** @format */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import a from "../constants/image/oo.png";

export default function FabricDataStore({ activeCategory, data }) {
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem("favorites");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    loadFavorites();
  }, []);

  if (!fontsLoaded || fontError) {
    return null;
  }

  const noResults = data.length === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.reliable}>{activeCategory}</Text>
      <View style={styles.pushdown}>
        <View style={styles.column}>
          {noResults ? (
            <Text style={styles.noResultsText}>No results found</Text>
          ) : (
            <View style={styles.cardContainer}>
              {data.map((fabric) => (
                <FabricCard
                  key={fabric._id}
                  fabric={{
                    ...fabric,
                    favorite: favorites[fabric._id] || false,
                  }}
                  toggleFavorite={async () => {
                    try {
                      const newFavorites = {
                        ...favorites,
                        [fabric._id]: !favorites[fabric._id],
                      };
                      setFavorites(newFavorites);
                      await AsyncStorage.setItem(
                        "favorites",
                        JSON.stringify(newFavorites)
                      );
                    } catch (error) {
                      console.error("Error saving favorite:", error);
                    }
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const FabricCard = ({ fabric, toggleFavorite }) => {
  const router = useRouter();

  const gotocreataccount = () => {
    router.push(`/product/${fabric._id}`);
  };
  const getStockStatus = () => {
    if (fabric.inStock === "false") {
      return {
        text: "Out of Stock",
        style: styles.outOfStockBadge,
        textStyle: styles.outOfStockText,
      };
    } else if (Number(fabric.quantity) < 50) {
      return {
        text: "Low Stock",
        style: styles.lowStockBadge,
        textStyle: styles.lowStockText,
      };
    } else if (fabric.inStock === "true" && Number(fabric.quantity) >= 50) {
      return {
        text: "Active",
        style: styles.activeBadge,
        textStyle: styles.activeText,
      };
    }
    return null;
  };

  const stockStatus = getStockStatus();

  return (
    <TouchableOpacity onPress={gotocreataccount} style={styles.card}>
      <View style={styles.imageHolder}>
        <Image
          style={styles.image}
          source={fabric.image || a}
          resizeMode="cover"
          defaultSource={a}
        />
        {stockStatus && (
          <View style={stockStatus.style}>
            <Text style={stockStatus.textStyle}>{stockStatus.text}</Text>
          </View>
        )}
      </View>
      <View style={styles.negetive}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{fabric.name}</Text>
          {fabric.colors && fabric.colors.length > 0 && (
            <View style={styles.colorsContainer}>
              {fabric.colors.slice(0, 3).map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.colorDot,
                    { backgroundColor: color.replace(/["\[\]]/g, "") },
                  ]}
                />
              ))}
              {fabric.colors.length > 3 && (
                <Text style={styles.moreColorsText}>
                  +{fabric.colors.length - 3}
                </Text>
              )}
            </View>
          )}
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          <View style={fabric.favorite ? styles.holi : styles.holi2}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={fabric.favorite ? "#F11515" : "black"}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.price}>{fabric.price}</Text>
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
    marginLeft: 0,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  moreColorsText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  outOfStockBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 5,
    borderRadius: 4,
  },
  outOfStockText: {
    color: "white",
    fontSize: 12,
    fontFamily: "KumbhSans_400Regular",
  },
  card: {
    marginBottom: 30,
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
    flex: 1,
  },
  negetive: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 7,
  },
  name: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "left",
    color: "#000000",
    textTransform: "capitalize",
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
    color: "#FF0000",
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
