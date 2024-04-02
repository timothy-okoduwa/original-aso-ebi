import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import a from '../constants/image/graf.png';
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
export default function Categories({ setActiveCategory, activeCategory }) {
  const categories = [
    'New Arrival',
    'Lace',
    'Senator',
    'Guinea',
    'Cotton',
    'Polyester',
    'Silk',
    'Linen',
    'Wool',
    'Denim',
    'Velvet',
    'Satin',
    'Chiffon',
    'Rayon',
    'Flannel',
    'Organza',
    'Tulle',
    'Cashmere',
    'Tweed',
    'Corduroy',
    'Spandex',
    'Taffeta',
    'Georgette',
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: item === activeCategory ? '#000' : '#F5F5F5' },
      ]}
      onPress={() => setActiveCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          { color: item === activeCategory ? '#FFF' : '#000' },
        ]}
      >
        {item}
      </Text>
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
            <View>
              <TouchableOpacity style={styles.create}>
                <Text style={{ color: 'white' }}>🔥Shop Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 43,
  },
  categoryText: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    color: '#000000',
  },
  banner: {
    marginTop: 30,

    width: '100%',
    height: 140, // Set the desired height of the banner
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
});
