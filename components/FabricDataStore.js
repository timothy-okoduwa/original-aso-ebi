import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import a from '../constants/image/oo.png';

export default function FabricDataStore({ activeCategory, data }) {
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

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
              {data.map((fabric, index) => (
                <FabricCard key={index} fabric={fabric} />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const FabricCard = ({ fabric }) => {
  const [isFavorite, setIsFavorite] = useState(fabric.favorite || false);
  const router = useRouter();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    fabric.favorite = !isFavorite;
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
          <Text style={styles.name}>{fabric.name.replace(/-/g, ' ')}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          {!isFavorite ? (
            <Ionicons name="heart-outline" size={18} color="black" />
          ) : (
            <Ionicons name="heart-sharp" size={18} color="black" />
          )}
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
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
  },
  pushdown: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginLeft: 0, // Add margin between columns
  },
  cardContainer: {
    flexDirection: 'row', // Display cards in a row
    flexWrap: 'wrap', // Allow cards to wrap to the next line if necessary
    justifyContent: 'space-between', // Space cards evenly within the container
  },
  card: {
    marginBottom: 30, // Add margin between cards
    width: '48%', // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 10,
  },
  imageHolder: {
    height: 180, // Adjust card height as needed
    width: '100%', // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  negetive: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  name: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
  },
  price: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 17,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
    marginTop: 10,
  },
  noResultsText: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    color: '#FF0000', // Red color for indicating no results
  },
});
