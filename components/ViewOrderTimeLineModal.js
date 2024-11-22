/** @format */

import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { Modal } from "react-native"; // Ensure this is the native modal
import Icon from "react-native-vector-icons/MaterialIcons";

const { height } = Dimensions.get("window");

const ViewOrderTimeLineModal = ({ visible, onClose }) => {
  const steps = [
    {
      title: "Confirm Order",
      description: "Your order has been confirmed.",
      time: "5:20pm",
      completed: true,
    },
    {
      title: "Preparing Order",
      description: "Your order is being prepared.",
      time: "5:25pm",
      completed: true,
    },
    {
      title: "Shipped",
      description: "Your order has been given to our rider.",
      time: "5:30pm",
      completed: true,
    },
    {
      title: "In Transit",
      description: "Your order is en route to you.",
      time: "5:35pm",
      completed: true,
    },
    {
      title: "Package is here!",
      description: "Yay! Your package is here.",
      time: "6:30pm",
      completed: true,
    },
  ];

  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none" // Use animation handled by Animated API
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.header}>Order Progress</Text>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <View style={styles.iconWrapper}>
                  <Icon
                    name={
                      step.completed ? "check-circle" : "radio-button-unchecked"
                    }
                    size={24}
                    color={step.completed ? "green" : "gray"}
                  />
                  {index < steps.length - 1 && (
                    <View style={styles.dashedLine} />
                  )}
                </View>
                <View style={styles.textWrapper}>
                  <Text
                    style={[
                      styles.title,
                      step.completed && styles.completedText,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <View style={styles.flexup}>
                    <Text style={styles.description}>{step.description}</Text>
                    <Text style={styles.description}>{step.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 9999,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    height: height * 0.6,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 20,
  },
  iconWrapper: {
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  dashedLine: {
    width: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    borderStyle: "dashed",
  },
  title: {
    fontSize: 19,
    color: "#121212",
  },
  description: {
    fontSize: 16,
    color: "#444444",
  },
  completedText: {
    color: "green",
  },
  flexup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ViewOrderTimeLineModal;
