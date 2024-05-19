import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import ButtomNav from '../components/ButtomNav';
import { StatusBar } from 'expo-status-bar';
import data from '../components/data';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function favourite() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  // Filter data where favourite is true
  const favoriteData = data.filter((item) => item.favorite);

  // Extract unique categories and their images from filtered data
  const categories = [];
  const categoryMap = {};

  favoriteData.forEach((item) => {
    if (!categoryMap[item.category]) {
      categoryMap[item.category] = item.image;
      categories.push({
        name: item.name,
        image: item.image,
        price: item.price,
      });
    }
  });
  const gotocreataccount = (fabricName) => {
    router.push(`/${fabricName}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <Text style={styles.store}>Favorites</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View style={styles.okay}>
            <View style={styles.pushdown}></View>

            <View style={styles.cardContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => gotocreataccount(category.name)}
                >
                  <View style={styles.imageHolder}>
                    <Image
                      style={styles.image}
                      source={category.image}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.negetive}>
                    <View>
                      <Text style={styles.name}>
                        {category.name.replace(/-/g, ' ')}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="heart-sharp" size={18} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={styles.price}>{category.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
  pushdown: {
    marginTop: 20,
    marginBottom: 30,
  },
  select: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 19,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    marginBottom: 30,
    width: '48%',
    borderRadius: 10,
  },
  imageHolder: {
    height: 180,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  imageText: {
    color: 'white',
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 19,
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
});
