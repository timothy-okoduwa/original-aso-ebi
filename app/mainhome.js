import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import HeadAndNotification from '../components/HeadAndNotification';
import SearchCompnent from '../components/SearchCompnent';
import Categories from '../components/Categories';
import FabricData from '../components/FabricData';
import data from '../components/data';
import ButtomNav from '../components/ButtomNav';
import { StatusBar } from 'expo-status-bar';
import { useLoading } from './LoadingContext';
export default function mainhome() {
  const [activeCategory, setActiveCategory] = useState('New Arrival');
  const [searchQuery, setSearchQuery] = useState('');
  const { showLoading, hideLoading } = useLoading();
  console.log('Active Category:', activeCategory); // Debugging
  console.log('Search Query:', searchQuery); // Debugging
  console.log('Data:', data); // Debugging

  let filteredData = data.filter((fabric) =>
    fabric.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeCategory !== 'New Arrival') {
    filteredData = filteredData.filter(
      (fabric) => fabric.category === activeCategory
    );
  }
  useEffect(() => {
    // Simulate data loading
    showLoading();
    const timeout = setTimeout(() => {
      hideLoading();
    }, 1000); // Adjust the timeout to simulate data loading time

    return () => clearTimeout(timeout);
  }, []);

  console.log('Filtered Data:', filteredData); // Debugging
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <HeadAndNotification />
          <SearchCompnent setSearchQuery={setSearchQuery} />
          <Categories
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
          <FabricData
            activeCategory={activeCategory}
            initialData={filteredData}
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
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0, // Adjust this value to accommodate the height of your ButtomNav component
  },
  main: {
    padding: 15,
    flex: 1,
  },
});
