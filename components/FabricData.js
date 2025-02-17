import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ActivityIndicator 
} from "react-native";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import a from "../constants/image/oo.png";
import {Skeleton} from './Spinner'
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = "https://oae-be.onrender.com/api/oae";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

export default function FabricData({ activeCategory, searchQuery }) {
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);
  // Fetch both products and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories first
        const categoriesResponse = await axios.get(`${BASE_URL}/categories/all-categories`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });
        setCategories(categoriesResponse.data.data);

        // Then fetch products
        const productsResponse = await axios.get(`${BASE_URL}/products/all-products`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        setProducts(productsResponse.data.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search query and active category
  useEffect(() => {
    let filtered = [...products];
    
    // Search filter
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product => {
        const matchesName = product.categoryTitle.toLowerCase().includes(lowercaseQuery);
        const matchesCategory = categories.some(cat => 
          cat.categoryName.toLowerCase().includes(lowercaseQuery) && 
          cat._id === product.category
        );
        return matchesName || matchesCategory;
      });
    }
    
    // Category filter
    if (activeCategory && activeCategory !== "All Products") {
      const selectedCategory = categories.find(
        cat => cat.categoryName === activeCategory
      );
      if (selectedCategory) {
        filtered = filtered.filter(
          product => product.category === selectedCategory._id
        );
      }
    }

    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory, products, categories]);

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
      <Text style={styles.reliable}>
        {activeCategory || 'All Products'}
        {searchQuery ? ` - Search: "${searchQuery}"` : ''}
      </Text>
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

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const toggleFavorite = async (productId) => {
    try {
      const newFavorites = {
        ...favorites,
        [productId]: !favorites[productId]
      };
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.reliable}>
        {activeCategory || 'All Products'}
        {searchQuery ? ` - Search: "${searchQuery}"` : ''}
      </Text>
      <View style={styles.pushdown}>
        <View style={styles.column}>
          {filteredProducts.length === 0 ? (
            <Text style={styles.noResultsText}>
              {searchQuery 
                ? "No products found matching your search"
                : "No products found in this category"}
            </Text>
          ) : (
            <View style={styles.cardContainer}>
              {filteredProducts.map((product) => (
                <FabricCard
                  key={product._id}
                  fabric={{
                    id: product._id,
                    name: product.categoryTitle,
                    price: product.price,
                    image: product.image && product.image.length > 0 
                      ? { uri: product.image[0] }
                      : a,
                      favorite: favorites[product._id] || false,
                                          colors: product.colors,
                    inStock: product.inStock,
                    quantity: product.quantity
                  }}
                  toggleFavorite={() => toggleFavorite(product._id)}
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
    router.push(`/product/${fabric.id}`);
  };

  return (
    <TouchableOpacity onPress={gotocreataccount} style={styles.card}>
      <View style={styles.imageHolder}>
        <Image
          style={styles.image}
          source={fabric.image}
          resizeMode="cover"
          defaultSource={a}
        />
        {fabric.inStock === "false" && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
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
                  style={[styles.colorDot, { backgroundColor: color.replace(/["\[\]]/g, '') }]}
                />
              ))}
              {fabric.colors.length > 3 && (
                <Text style={styles.moreColorsText}>+{fabric.colors.length - 3}</Text>
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#FF0000",
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  moreColorsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 4,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 12,
    fontFamily: "KumbhSans_400Regular",
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
    marginBottom: 30,
    width: "48%",
    borderRadius: 10,
  },
  imageHolder: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    position: 'relative',
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
    textTransform: 'capitalize',
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
});