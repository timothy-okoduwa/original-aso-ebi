import React, { useState, useCallback,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
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
import { useRouter } from 'expo-router';
import debounce from 'lodash/debounce';
import { Skeleton } from './Spinner'; // Update this path

const SearchSkeleton = () => (
  <View style={styles.mainhead}>
    <View style={styles.flexes}>
      {/* Search Input Skeleton */}
      <View style={styles.forsearch}>
        <View style={[styles.searchInputContainer, { backgroundColor: 'transparent' }]}>
          <Skeleton 
            width="110%" 
            height={50}
            style={{
              borderRadius: 8,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        </View>
      </View>

      {/* Search Button Skeleton */}
      <View style={styles.hanging}>
        <Skeleton 
          width="100%" 
          height={50}
          style={{
            borderRadius: 10
          }}
        />
      </View>

      {/* Favorites Button Skeleton */}
      <View style={styles.love}>
        <Skeleton 
          width="100%" 
          height={50}
          style={{
            borderRadius: 10
          }}
        />
      </View>
    </View>
  </View>
);

export default function SearchComponent({ setSearchQuery }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  
    return () => clearTimeout(timer);
  }, []);

  const debouncedSearch = useCallback(
    debounce((text) => {
      setSearchQuery(text);
    }, 300),
    [setSearchQuery]
  );

  const handleTextChange = (text) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSearchQuery('');
  };

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
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  if (isLoading) {
    return <SearchSkeleton />;
  }

  const gotofavs = () => {
    router.push('/favourite');
  };

  return (
    <View style={styles.mainhead}>
      <View style={styles.flexes}>
        <View style={styles.forsearch}>
          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.inputt}
              placeholder="Search products or categories"
              value={searchText}
              onChangeText={handleTextChange}
              placeholderTextColor="#999"
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <Feather name="x" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.hanging}>
          <TouchableOpacity 
            style={[
              styles.create,
              !searchText && styles.createDisabled
            ]} 
            onPress={handleSearch}
            disabled={!searchText}
          >
            <Text style={{ color: 'white' }}>Search</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.love}>
          <TouchableOpacity style={styles.create2} onPress={gotofavs}>
            <Feather name="heart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainhead: {
    marginTop: 30,
  },
  flexes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forsearch: {
    width: '60%',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  clearButton: {
    padding: 5,
  },
  inputt: {
    flex: 1,
    height: '100%',
    fontFamily: 'KumbhSans_400Regular',
  },
  hanging: {
    width: '23%',
  },
  love: {
    width: '13%',
  },
  create: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
  },
  createDisabled: {
    backgroundColor: '#666666',
  },
  create2: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 50,
    borderColor: '#D7D8DB',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'transparent',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
  },
});