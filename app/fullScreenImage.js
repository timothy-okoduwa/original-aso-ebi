import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import { StatusBar } from 'expo-status-bar';

const fullScreenImages = () => {
  const router = useRouter();
  const { images, initialIndex } = useLocalSearchParams();
  const imageArray = JSON.parse(images);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="keyboard-arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <Swiper
        style={styles.wrapper}
        showsButtons={false} // Example of a carousel option
        autoplay={true} // Example of a carousel option
        autoplayTimeout={3} // Example of a carousel option
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        index={initialIndex}
      >
        {imageArray.map((image, index) => (
          <View style={styles.slide} key={index}>
            <Image style={styles.image} source={image} resizeMode="contain" />
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    // flex: 1,
    backgroundColor: 'white',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00000088',
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 20,
    // padding: 5,
  },
  slide: {
    height: '90%',
  },
});

export default fullScreenImages;
