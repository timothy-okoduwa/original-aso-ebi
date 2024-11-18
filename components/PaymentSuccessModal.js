/** @format */

import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter

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
} from "@expo-google-fonts/kumbh-sans";
const { height } = Dimensions.get("window"); // Get the screen height

const PaymentSuccessModal = ({ visible, onClose }) => {
  const router = useRouter();
  const move = () => {
    router.push("/order");
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Detects press outside the modal content */}
      <Pressable style={styles.modalContainer} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <View style={styles.roundd}>
            <MaterialIcons name="check-circle" size={40} color="green" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Order Successful</Text>

          {/* Message */}
          <Text style={styles.message}>
            Your payment has been made and your order created. Check your
            notifications to track your items.
          </Text>

          {/* Done Button */}
          <Pressable style={styles.create} onPress={move}>
            <Text style={styles.doneButtonText}>Track Order</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align the modal to the bottom
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    height: height * 0.5, // Modal takes 50% of the screen height
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    // justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 18,
    fontFamily: "KumbhSans_500Medium",
    marginVertical: 20,
  },
  message: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    textAlign: "center",
    color: "#5E5E5E",

    marginBottom: 20,
  },
  create: {
    width: "100%",
    height: 55,
    backgroundColor: "#000000",

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  roundd: {
    width: 86.98,
    height: 86.98,
    backgroundColor: "#F9F9F9",
    borderRadius: 43.49,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaymentSuccessModal;
