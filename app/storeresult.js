import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import ButtomNav from '../components/ButtomNav';
import data from '../components/data';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import SearchComponent from '../components/SearchCompnent';
import CategoriesStore from '../components/CategoriesStore';
import FabricDataStore from '../components/FabricDataStore';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function storeresult() {
  const [activeCategory, setActiveCategory] = useState('New Arrival');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { category } = useLocalSearchParams();

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
  }, [category]);

  let filteredData = data;

  if (activeCategory !== 'New Arrival') {
    filteredData = data.filter(
      (fabric) =>
        fabric.category === activeCategory &&
        fabric.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    filteredData = data.filter((fabric) =>
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="white" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Store</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View>
            <SearchComponent setSearchQuery={setSearchQuery} />
          </View>
          <CategoriesStore
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
          <FabricDataStore
            activeCategory={activeCategory}
            data={filteredData}
          />
        </View>
      </ScrollView>
      <ButtomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0, // Adjust this value to accommodate the height of your ButtomNav component
    paddingTop: 100, // Add enough padding to the top to avoid overlap
  },
  main: {
    padding: 15,
    flex: 1,
  },
  storeview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 45,
    alignItems: 'center',
  },
  store: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 40,
  },
});
