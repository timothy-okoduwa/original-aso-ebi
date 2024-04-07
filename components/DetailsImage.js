import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import s from '../constants/image/sen2.png';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-swiper';
import data from './data';
export default function DetailsImage({ partName }) {
  const router = useRouter();
  const gobckhome = () => {
    router.push('/mainhome');
  };
  // Find the object in the data array with the same name as partName
  const fabric = data?.find((item) => item?.name === partName);
  console.log('Carousel Images:', fabric?.carouselImages);
  console.log(' Images:', fabric?.image);

  // Check if fabric is found
  if (fabric) {
    // Use fabric object to render details
    return (
      <View>
        <View style={styles.main}>
          <View style={styles.abs}>
            <TouchableOpacity style={styles.backButton} onPress={gobckhome}>
              <Text>
                <MaterialIcons
                  name="keyboard-arrow-left"
                  size={37}
                  color="#0F172A"
                />
              </Text>
            </TouchableOpacity>
          </View>
          <Swiper
            style={styles.wrapper}
            showsButtons={false} // Example of a carousel option
            autoplay={true} // Example of a carousel option
            autoplayTimeout={3} // Example of a carousel option
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            {fabric.carouselImages.map((image, index) => (
              <View style={styles.slide} key={index}>
                <Image style={styles.image} source={image} resizeMode="cover" />
              </View>
            ))}
          </Swiper>
        </View>
      </View>
    );
  } else {
    // If fabric is not found, render an appropriate message or fallback component
    return <Text>Fabric not found</Text>;
  }
}
const styles = StyleSheet.create({
  main: {
    height: 400,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  abs: {
    position: 'absolute',
    zIndex: 999,
    padding: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 4,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF99',
  },
  dot: {
    backgroundColor: '#CFCFCF',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 300,
  },
  activeDot: {
    backgroundColor: '#000000',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 300,
  },
});
