import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import HeadAndNotification from '../components/HeadAndNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchCompnent from '../components/SearchCompnent';
import Categories from '../components/Categories';
import FabricData from '../components/FabricData';
import data from '../components/data';
import ButtomNav from '../components/ButtomNav';
import { StatusBar } from 'expo-status-bar';
import { useLoading } from './LoadingContext';
export default function mainhome() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('New Arrival');
    const [userName, setUserName] = useState('');
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
       const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // Simulate fetching user info with the token
          // Replace with actual API call to get user info if necessary
          const fetchedUserName = 'John Doe'; // Example user name, replace with actual data
          setUserName(fetchedUserName);
        } else {
          console.log('No user token found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    // Simulate data loading
    showLoading();
    const timeout = setTimeout(() => {
      hideLoading();
    }, 1000); // Adjust the timeout to simulate data loading time

    return () => clearTimeout(timeout);
  }, []);

  console.log('Filtered Data:', filteredData); // Debugging
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      // After 2 seconds stop refreshing
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F11515', '#000000', '#0000ff']}
            tintColor="red"
            title="Pull to refresh..."
            titleColor="#00ff00"
          />
        }
      >
        <View style={styles.main}>
          <View>
            <Text> Welcome, {userName ? userName : 'Guest'}</Text>
          </View>
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
