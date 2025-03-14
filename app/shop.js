/** @format */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import ButtomNav from "../components/ButtomNav";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { useRouter } from "expo-router";
import { Skeleton } from "../components/Spinner";

const BASE_URL = "https://oae-be.onrender.com/api/oae";

export default function Shop() {
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const fetchCategories = async () => {
    try {
      const TOKEN = await AsyncStorage.getItem("token");
      setError(null);
      const response = await axios.get(
        `${BASE_URL}/categories/all-categories`,
      
      );
      setCategories(response.data.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  const goToCategory = (categoryId) => {
    router.push({
      pathname: "/storeresult",
      params: { categoryId },
    });
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
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Store</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F11515", "#000000", "#0000ff"]}
            tintColor="red"
            title="Pull to refresh..."
            titleColor="#00ff00"
          />
        }
      >
        <View style={styles.main}>
          <View style={styles.okay}>
            <View style={styles.pushdown}>
              <Text style={styles.select}>Select a category</Text>
            </View>

            {loading && !refreshing ? (
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
              <View style={styles.cardContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category._id}
                    style={styles.card}
                    onPress={() => goToCategory(category._id)}
                  >
                    <View style={styles.imageHolder}>
                      <Image
                        style={styles.image}
                        source={{ uri: category.categoryImage }}
                        resizeMode="cover"
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.imageText}>
                          {category.categoryName.charAt(0).toUpperCase() +
                            category.categoryName.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
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
  pushdown: {
    marginTop: 20,
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
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  imageText: {
    color: "white",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
    textTransform: "capitalize",
  },
  titleContainer: {
    flex: 1,
  },
  colorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
});
