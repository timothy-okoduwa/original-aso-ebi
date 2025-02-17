import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import a from '../constants/image/graf.png';
import axios from 'axios';
import {
  useFonts,
  KumbhSans_100Thin,
  KumbhSans_200ExtraLight,
  KumbhSans_300Light,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
  KumbhSans_900Black,
} from '@expo-google-fonts/kumbh-sans';
import { Ledger_400Regular } from '@expo-google-fonts/ledger';
import { useRouter } from 'expo-router';
import {Skeleton} from './Spinner'
const CategorySkeleton = () => {
  return (
    <View style={styles.categoryList}>
      {[1, 2, 3, 4].map((index) => (
        <Skeleton
          key={index}
          width={100}
          height={30}
          style={[
            styles.categoryItem,
            { marginRight: 10 }
          ]}
        />
      ))}
    </View>
  );
};
const BannerSkeleton = () => {
  return (
    <View style={styles.banner}>
      <Skeleton
        width="100%"
        height={140}
        style={{
          borderRadius: 20,
        }}
      />
    </View>
  );
};
const BASE_URL = "https://oae-be.onrender.com/api/oae";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRpbW15bGVlb2tvZHV3YTdAZ21haWwuY29tIiwiaWQiOiI2NzY1OTY1Yjc5NWE4ZDA1Mjc5ZWYwNjMiLCJpYXQiOjE3MzgyMzA4MzYsImV4cCI6MTc0MDgyMjgzNn0.XL6zUHtFJjLrW4lSH-ivzTIoK7p88WZkJOrOt-862q4";

export default function Categories({ setActiveCategory, activeCategory }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/all-categories/`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      // Add "All Products" as the first category
      const allProductsCategory = {
        _id: 'all-products',
        categoryName: 'All Products',
      };
      setCategories([allProductsCategory, ...response.data.data]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: item.categoryName === activeCategory ? '#000' : '#F5F5F5' },
      ]}
      onPress={() => setActiveCategory(item.categoryName)}
    >
      <View style={styles.categoryContent}>
       
        <Text
          style={[
            styles.categoryText,
            { color: item.categoryName === activeCategory ? '#FFF' : '#000' },
          ]}
        >
          {item.categoryName}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
    Ledger_400Regular,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const goToCategory = () => {
    router.push('/shop');
  };

  if (loading) {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <View style={{ marginBottom: 10 }}>
        <CategorySkeleton />
      </View>
      <BannerSkeleton />
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
      <View style={styles.banner}>
        <Image style={styles.backgroundImage} source={a} resizeMode="cover" />
        <View style={styles.bannerContent}>
          <View>
            <Text style={styles.omoh}>Checkout</Text>
            <Text style={styles.omoh}> New Arrivals</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.create} onPress={goToCategory}>
              <Text style={{ color: 'white' }}>🔥Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  title: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
    marginBottom: 10,
  },
  categoryList: {
    flexDirection: 'row',
  },
  categoryItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    minHeight: 30,
    minWidth: 100,
  },
  categoryContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 4,
  },
  categoryText: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  banner: {
    marginTop: 30,
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerContent: {
    flex: 1,
    paddingLeft: 30,
    flexDirection: 'row',
    paddingRight: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  omoh: {
    fontSize: 20,
    fontFamily: 'Ledger_400Regular',
    color: '#000000',
  },
  create: {
    fontFamily: 'KumbhSans_500Medium',
    width: 130,
    height: 40,
    backgroundColor: '#000000',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    fontSize: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
  },
  skeletonCategoryList: {
    flexDirection: 'row',
    paddingHorizontal: 0,
  },
  skeletonContainer: {
    opacity: 0.7,
  },
  categoryList: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});