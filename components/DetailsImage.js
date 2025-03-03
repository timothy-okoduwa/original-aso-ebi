/** @format */

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Swiper from "react-native-swiper";
 // Update this path
 import {Skeleton} from "./Spinner"

export default function DetailsImage({ product, loading = false }) {
  const router = useRouter();

  const goBackHome = () => {
    router.back();
  };

  const openFullScreenImage = (images, index) => {
    console.log("Opening fullscreen with images:", images);
    router.push({
      pathname: "/fullScreenImage",
      params: {
        images: encodeURIComponent(JSON.stringify(images)),
        initialIndex: index || 0,
      },
    });
  };

  // Show skeleton while loading
  if (loading) {
    return (
      <View style={styles.main}>
        <View style={styles.abs}>
          <TouchableOpacity style={styles.backButton} onPress={goBackHome}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={37}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.skeletonContainer}>
          {/* Main image skeleton */}
          <Skeleton 
            width="100%" 
            height={400} 
            style={styles.imageSkeleton} 
          />
          
          {/* Dots skeleton */}
          <View style={styles.dotContainer}>
            {[...Array(3)].map((_, index) => (
              <View key={index} style={styles.dotSkeleton}>
                <Skeleton 
                  width={10} 
                  height={10} 
                  style={styles.dot} 
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  // Check if product and images exist
  if (!product || !product.image || !product.image.length) {
    return (
      <View style={styles.main}>
        <View style={styles.abs}>
          <TouchableOpacity style={styles.backButton} onPress={goBackHome}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={37}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.slide, styles.noImageContainer]}>
          <Text>No images available</Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.main}>
        <View style={styles.abs}>
          <TouchableOpacity style={styles.backButton} onPress={goBackHome}>
            <MaterialIcons
              name="keyboard-arrow-left"
              size={37}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.slide}
          onPress={() => openFullScreenImage(product.image, 0)}
        >
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            autoplay={true}
            autoplayTimeout={3}
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
          >
            {product.image.map((imageUrl, index) => (
              <View style={styles.slide} key={index}>
                <Image
                  style={styles.image}
                  source={{ uri: imageUrl }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: 440,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    position: "relative",
    overflow: "hidden",
  },
  slide: {
    height: 440,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  image: {
    width: "100%",
    flex: 1,
  },
  abs: {
    position: "absolute",
    zIndex: 999,
    padding: 13,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF99",
  },
  dot: {
    backgroundColor: "#CFCFCF",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 300,
  },
  activeDot: {
    backgroundColor: "#000000",
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 300,
  },
  noImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  skeletonContainer: {
    height: 440,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageSkeleton: {
    borderRadius: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
  },
  dotSkeleton: {
    marginLeft: 3,
    marginRight: 3,
  }
});