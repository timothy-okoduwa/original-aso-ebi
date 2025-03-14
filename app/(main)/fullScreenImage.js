/** @format */

import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import { StatusBar } from "expo-status-bar";

const FullScreenImages = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [imageArray, setImageArray] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (!params.images) throw new Error("No images parameter received");

      let parsedImages;
      try {
        parsedImages = JSON.parse(decodeURIComponent(params.images));
      } catch (e) {
        console.error("Parsing error:", e);
        parsedImages = Array.isArray(params.images)
          ? params.images
          : [params.images];
      }

      if (!Array.isArray(parsedImages))
        throw new Error("Parsed images is not an array");

      // ✅ Only update state if the new images are different from the existing ones
      setImageArray((prevImages) => {
        const newImagesString = JSON.stringify(parsedImages);
        const prevImagesString = JSON.stringify(prevImages);
        return newImagesString !== prevImagesString ? parsedImages : prevImages;
      });
    } catch (err) {
      console.error("Error processing images:", err);
      setError(err.message);
    }
  }, [params.images]); // ✅ Depend only on params.images, not the whole params object

  console.log("Final Image Array in FullScreenImages:", imageArray);

  const startIndex = Number(params.initialIndex) || 0;

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Error loading images: {error}</Text>
      </View>
    );
  }

  if (imageArray.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.errorText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialIcons name="keyboard-arrow-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        loop={true}
        index={startIndex}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        {imageArray.map((imageUrl, index) => {
          console.log("Rendering image:", imageUrl);
          return (
            <View style={styles.slide} key={index}>
              <Image
                style={styles.image}
                source={{ uri: imageUrl }}
                resizeMode="contain"
                onError={(e) =>
                  console.error("Image failed to load:", imageUrl, e)
                }
                onLoad={() =>
                  console.log("Image loaded successfully:", imageUrl)
                }
              />
            </View>
          );
        })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  wrapper: {
    backgroundColor: "grey",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "grey",
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.8,
    backgroundColor: "grey",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  dot: {
    backgroundColor: "#CFCFCF",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 100,
    padding: 20,
  },
});

export default FullScreenImages;
