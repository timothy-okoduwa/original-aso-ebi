import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import HeadAndNotification from '../components/HeadAndNotification';
import SearchCompnent from '../components/SearchCompnent';
import Categories from '../components/Categories';
import FabricData from '../components/FabricData';
import data from '../components/data';
import ButtomNav from '../components/ButtomNav';

export default function mainhome() {
  const [activeCategory, setActiveCategory] = useState('New Arrival');
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <View style={styles.container}>
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

          <FabricData activeCategory={activeCategory} data={filteredData} />
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
