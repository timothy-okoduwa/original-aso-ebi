/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import {
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
import {
  Lora_400Regular,
  Lora_500Medium,
  Lora_600SemiBold,
  Lora_700Bold,
  Lora_400Regular_Italic,
  Lora_500Medium_Italic,
  Lora_600SemiBold_Italic,
  Lora_700Bold_Italic,
} from "@expo-google-fonts/lora";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function Billing({
  onNext,
  totalAmount,
  numberOfItems,
  orderedItems,
}) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  useEffect(() => {
    const testNotification = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification to check if notifications are working.",
          sound: true,
        },
        trigger: null, // Show immediately
      });
    };

    testNotification(); // Comment this out after testing
  }, []);
  const [addressList, setAddressList] = useState([
    {
      add: "No 104 mosafejor Road alaba lagos",
      phone: "09045339820",
      postal: "102103",
      zip: "897643",
    },
    {
      add: "No 6 saki cloase osapa london lekki lagos",
      phone: "09045339820",
      postal: "102103",
      zip: "897643",
    },
  ]);

  // New states for holding input values
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [newZip, setNewZip] = useState("");

  const handleSelectAddress = (index) => {
    setSelectedAddress(index);
  };

  const handleAddAddress = () => {
    setShowAddressForm(!showAddressForm); // Toggle the form visibility
  };

  const handleSubmitNewAddress = () => {
    const newEntry = {
      add: newAddress,
      phone: newPhone,
      postal: newPostal,
      zip: newZip,
    };

    setAddressList([...addressList, newEntry]); // Add the new address to the address list
    setShowAddressForm(false); // Close the address form

    // Clear input fields
    setNewAddress("");
    setNewPhone("");
    setNewPostal("");
    setNewZip("");
  };
  const [fontsLoaded, fontError] = useFonts({
    LexendDeca_400Regular,
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
    Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
    Lora_500Medium_Italic,
    Lora_600SemiBold_Italic,
    Lora_700Bold_Italic,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const orderedItemsArray = JSON.parse(orderedItems || "[]");
  // Debugging: Check if orderedItems is an array
  console.log(Array.isArray(orderedItems)); // Should log true
  console.log(orderedItems); // Check the contents of orderedItems
  const deliveryFee = 1000;
  const serviceFee = 500;
  const calculatedTotalAmount =
    parseFloat(totalAmount) + deliveryFee + serviceFee;

  return (
    <View style={styles.mainn}>
      <Text style={styles.store}>Billing Address</Text>
      <View style={styles.otheradd}>
        {addressList.map((ad, index) => (
          <TouchableOpacity
            style={styles.pettt}
            key={index}
            onPress={() => handleSelectAddress(index)}
          >
            <View style={styles.pound}>
              <View style={styles.iconz}>
                <EvilIcons name="location" size={24} color="black" />
              </View>
              <View>
                <Text style={styles.plat}>
                  {ad.add.length > 33
                    ? `${ad.add.substring(0, 33)}...`
                    : ad.add}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  height: "100%",
                  flexDirection: "column",
                  paddingTop: 8,
                  alignItems: "center",
                }}
              >
                {selectedAddress === index ? (
                  <MaterialIcons
                    name="radio-button-checked"
                    size={24}
                    color="black"
                  />
                ) : (
                  <MaterialIcons
                    name="radio-button-unchecked"
                    size={24}
                    color="black"
                  />
                )}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.iuru}>
        <TouchableOpacity onPress={handleAddAddress}>
          <Text style={styles.shish}>
            {showAddressForm ? "Hide Address Form" : "Add Address"}
          </Text>
        </TouchableOpacity>
      </View>
      {showAddressForm && (
        <View style={styles.inputs}>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.labell}>Address</Text>
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={styles.inputt}
                placeholder="Address"
                keyboardType="default"
                placeholderTextColor="#999"
                value={newAddress}
                onChangeText={(text) => setNewAddress(text)}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.labell}>Phone Number</Text>
            <View style={{ marginTop: 8 }}>
              <TextInput
                style={styles.inputt}
                placeholder="09074927137"
                keyboardType="phone-pad"
                placeholderTextColor="#999"
                maxLength={15}
                value={newPhone}
                onChangeText={(text) => setNewPhone(text)}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 30,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.labell}>Postal Code (optional)</Text>
              <View style={{ marginTop: 8 }}>
                <TextInput
                  style={styles.inputt2}
                  placeholder="Postal Code"
                  keyboardType="default"
                  placeholderTextColor="#999"
                  maxLength={15}
                  value={newPostal}
                  onChangeText={(text) => setNewPostal(text)}
                />
              </View>
            </View>
            <View>
              <Text style={styles.labell}>Zipcode (optional)</Text>
              <View style={{ marginTop: 8 }}>
                <TextInput
                  style={styles.inputt2}
                  placeholder="Zipcode"
                  keyboardType="default"
                  placeholderTextColor="#999"
                  maxLength={15}
                  value={newZip}
                  onChangeText={(text) => setNewZip(text)}
                />
              </View>
            </View>
          </View>
          <View style={styles.flux}>
            <TouchableOpacity
              style={[
                styles.create,
                {
                  backgroundColor:
                    !newAddress || !newPhone ? "#424242" : "#000000",
                }, // Set opacity based on conditions
              ]}
              onPress={handleSubmitNewAddress}
              disabled={!newAddress || !newPhone} // Disable the button if fields are empty
            >
              <Text style={styles.first}>Add Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.thatfroam}>
        <View style={styles.fki2}>
          {orderedItemsArray.map((item, index) => (
            <View style={styles.sponner} key={index}>
              <View>
                <Text style={styles.shish2}>
                  {item.name.replace(/-/g, " ")}
                </Text>
              </View>
              <View>
                <Text style={styles.shish2}>
                  {item.quantity} yards ( ₦
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                  )
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.sponner2}>
            <View>
              <Text style={styles.shish2}>
                Sub-total ({numberOfItems} items)
              </Text>
            </View>
            <View>
              <Text style={styles.shish2}>
                ₦
                {Number(totalAmount).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sponner}>
          <View>
            <Text style={styles.shish2}>Delivery Fee</Text>
          </View>
          <View>
            <Text style={styles.shish2}>₦{deliveryFee}</Text>
          </View>
        </View>
        <View style={styles.sponner}>
          <View>
            <Text style={styles.shish2}>Service Fee</Text>
          </View>
          <View>
            <Text style={styles.shish2}>₦{serviceFee}</Text>
          </View>
        </View>

        <View style={styles.sponner}>
          <View>
            <Text style={styles.shish3}>Total</Text>
          </View>
          <View>
            <Text style={styles.shish3}>
              ₦
              {calculatedTotalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 60 }}>
        <View style={styles.fkie}>
          <Text style={styles.delivv}>Delivery Information</Text>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.deliv2}>
              Items will be delivered to the above address. You would receive
              notification to track your delivery.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.flux}>
        <TouchableOpacity
          style={[
            styles.create,
            {
              backgroundColor: selectedAddress !== null ? "#000000" : "#424242",
            },
          ]}
          onPress={
            selectedAddress !== null
              ? () => onNext(calculatedTotalAmount)
              : null
          } // Enable or disable onPress
          disabled={selectedAddress === null} // Disable the button if no address is selected
        >
          <Text style={styles.first}>Proceed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  delivv: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 16,
  },
  deliv2: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 14,
  },
  store: {
    fontFamily: "KumbhSans_400Regular",
    color: "#000000",
    fontSize: 20,
  },
  mainn: {
    flex: 1,
  },
  inputs: {
    marginTop: 30,
  },
  labell: {
    // marginBottom: ,
    fontFamily: "LexendDeca_400Regular",
    fontSize: 16,

    lineHeight: 20,
    textAlign: "left",
    color: "#6B6B6B",
  },
  label: {
    marginLeft: 15,
    width: "80%",
    fontFamily: "Lora_400Regular",
    fontSize: 14,

    lineHeight: 18,
    textAlign: "left",
    color: "#1D1D1D",
  },
  inputt: {
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    width: "100%",
  },
  inputt2: {
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    width: 160,
  },
  scares: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'red',
    width: "100%",
    backgroundColor: "#ffffff",
    borderColor: "gray",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,

    paddingRight: 20,
  },
  inputContainer: {
    flex: 1, // Make the container flex to fill the available space
  },

  fkie: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "100%",
    padding: 20,
  },
  fki2: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    width: "100%",
    padding: 10,
    marginBottom: 17,
  },
  flux: {
    backgroundColor: "white",
    marginTop: 50,
  },
  create: {
    fontFamily: "KumbhSans_500Medium",
    width: "100%",
    height: 55,
    backgroundColor: "#000000",
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  first: {
    color: "white",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  otheradd: {
    marginTop: 40,
  },
  pettt: {
    width: "100%",
    padding: 15,
    height: 70,
    borderRadius: 16,
    borderColor: "#E9E9E9",
    borderWidth: 1,
    borderStyle: "solid",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  plat: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "KumbhSans_500Medium",
  },
  pound: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconz: {
    marginRight: 7,
  },
  iuru: {
    width: "100%",

    alignItems: "flex-end", // Move the content to the right
    paddingRight: 10, // Optional: Add padding to the right
  },
  shish: { color: "#000000", fontSize: 18, fontFamily: "KumbhSans_500Medium" },
  thatfroam: {
    marginTop: 40,
    borderTopWidth: 0.4,
    borderTopColor: "#5E5E5E",
    paddingTop: 30, // Optional: Add some padding for spacing
  },
  sponner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  sponner2: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shish2: { color: "#444444", fontSize: 16, fontFamily: "KumbhSans_500Medium" },
  shish3: { color: "#000000", fontSize: 20, fontFamily: "KumbhSans_500Medium" },
});
