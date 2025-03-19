import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import {
  useFonts,
  LexendDeca_400Regular,
} from "@expo-google-fonts/lexend-deca";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const storeAddress = "No 28-30 John Street, Idumota, Lagos, Nigeria";
  const [deliveryFee, setDeliveryFee] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  // New states for holding input values
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPostal, setNewPostal] = useState("");
  const [newZip, setNewZip] = useState("");

  // Get user data from AsyncStorage
  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (storedUserId && storedToken) {
          setUserId(storedUserId);
          setToken(storedToken);
          // Once we have the user data, fetch addresses
          fetchAddresses(storedUserId, storedToken);
        } else {
          setErrorMessage("Please login to continue");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        setErrorMessage("Error retrieving user data");
        setIsLoading(false);
      }
    };
    
    getUserData();
  }, []);

  // Fetch addresses from API
  const fetchAddresses = async (id, authToken) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/address/all-user-address/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Updated to match the exact structure from the API
      if (data.message === "User addresses retrieved successfully" && Array.isArray(data.data)) {
        setAddressList(data.data);
      } else {
        console.log("Unexpected API response structure:", data);
        setAddressList([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setErrorMessage("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  // Add address to API
  const addAddressToAPI = async () => {
    if (!userId || !token) {
      Alert.alert("Error", "You must be logged in to add an address");
      return;
    }
    
    setIsLoading(true);
    try {
      // Log the request for debugging
      console.log("Adding address with data:", {
        address: newAddress,
        phoneNumber: newPhone,
        postalCode: newPostal,
        zipCode: newZip
      });
      
      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/address/add-address/${userId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            address: newAddress,
            phoneNumber: newPhone,
            postalCode: newPostal,
            zipCode: newZip
          })
        }
      );
      
      // Get the full response text
      const responseText = await response.text();
      console.log("API Response:", responseText);
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Invalid response format");
      }
      
      // Check different possible success indicators
      if (data.success || data.message === "Address added successfully" || 
          (data.data && data.data._id) || response.ok) {
        // Refresh address list
        fetchAddresses(userId, token);
        setShowAddressForm(false);
        // Clear input fields
        setNewAddress("");
        setNewPhone("");
        setNewPostal("");
        setNewZip("");
        
        // Show success message
        Alert.alert("Success", "Address added successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      Alert.alert("Error", "Failed to add address: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete address from API
  const deleteAddress = async (addressId) => {
    if (!userId || !token) {
      Alert.alert("Error", "You must be logged in to delete an address");
      return;
    }
    
    console.log("Attempting to delete address with ID:", addressId);
    
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const deleteUrl = `https://oae-be.onrender.com/api/oae/address/delete-address/${userId}/${addressId}`;
              console.log("Delete URL:", deleteUrl);
              
              const response = await fetch(deleteUrl, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              // Get the response data
              const responseData = await response.json();
              console.log("Delete response:", responseData);
              
              if (response.ok) {
                console.log("Delete successful, refreshing address list");
                // Refresh address list
                fetchAddresses(userId, token);
                
                // Reset selected address if it was deleted
                if (selectedAddress !== null && addressList[selectedAddress]._id === addressId) {
                  setSelectedAddress(null);
                }
                
                Alert.alert("Success", "Address deleted successfully");
              } else {
                Alert.alert("Error", responseData.message || "Failed to delete address");
              }
            } catch (error) {
              console.error("Error deleting address:", error);
              Alert.alert("Error", "Failed to delete address: " + error.message);
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    // Request location permissions on component mount
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }
    })();
  }, []);

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

    // testNotification(); // Comment this out after testing
  }, []);

  const calculateDeliveryFee = async (address) => {
    console.log("Calculating delivery fee for address:", address.address || address.add);
    
    try {
      // First attempt: Try direct geocoding
      const addressText = address.address || address.add;
      const result = await tryGeocoding(addressText, storeAddress);
      
      if (result.success) {
        // Use the calculated distance to set delivery fee
        setDeliveryFeeByDistance(result.distance);
        return;
      }
      
      // Second attempt: Try with city/state appended if not already present
      if (!addressText.toLowerCase().includes('lagos')) {
        const enhancedAddress = `${addressText}, Lagos, Nigeria`;
        console.log("Trying with enhanced address:", enhancedAddress);
        
        const secondResult = await tryGeocoding(enhancedAddress, storeAddress);
        if (secondResult.success) {
          setDeliveryFeeByDistance(secondResult.distance);
          return;
        }
      }
      
      // Third attempt: Fall back to area-based detection
      console.log("Falling back to area-based detection");
      setDeliveryFeeByArea(addressText);
      
    } catch (error) {
      console.error("Error calculating delivery fee:", error);
      // Final fallback
      setDeliveryFeeByArea(address.address || address.add);
    }
  };
  
  // Helper function to attempt geocoding and distance calculation
  const tryGeocoding = async (userAddress, storeAddr) => {
    try {
      // Get coordinates for store
      const storeLocationResult = await Location.geocodeAsync(storeAddr);
      
      // Get coordinates for selected address
      const userLocationResult = await Location.geocodeAsync(userAddress);
      
      if (storeLocationResult.length > 0 && userLocationResult.length > 0) {
        const storeLoc = storeLocationResult[0];
        const userLoc = userLocationResult[0];
        
        // Calculate distance
        const distance = calculateDistance(
          storeLoc.latitude, 
          storeLoc.longitude, 
          userLoc.latitude, 
          userLoc.longitude
        );
        console.log("Calculated distance:", distance, "km");
        
        return { success: true, distance };
      }
      return { success: false };
    } catch (error) {
      console.error("Geocoding failed:", error);
      return { success: false, error };
    }
  };
  
  const setDeliveryFeeByDistance = (distance) => {
    if (distance <= 5) {
      console.log("Distance <= 5km");
      setDeliveryFee(1500);
    } else if (distance <= 10) {
      console.log("Distance <= 10km");
      setDeliveryFee(2000);
    } else if (distance <= 15) {
      console.log("Distance <= 15km");
      setDeliveryFee(2500);
    } else if (distance <= 20) {
      console.log("Distance <= 20km");
      setDeliveryFee(3000);
    } else {
      console.log("Distance > 20km");
      setDeliveryFee(3500);
    }
  };
  
  // Enhanced area detection using more keywords and regions
  const setDeliveryFeeByArea = (address) => {
    const addressLower = address.toLowerCase();
    
    // Lagos Island detection (expanded)
    if (isInLagosIsland(addressLower)) {
      console.log("Address identified as Lagos Island");
      setDeliveryFee(1000);
      return;
    }
    
    // Other specific areas with known rates
    const areaRates = [
      { keywords: ['victoria island', 'vi', 'oniru', 'lekki phase 1', 'maruwa'], fee: 1500 },
      { keywords: ['lekki', 'chevron', 'ajah', 'ikate', 'osapa london', 'ologorlor'], fee: 2500 },
      { keywords: ['ikoyi', 'obalende'], fee: 1500 },
      { keywords: ['surulere', 'yaba', "Abule ijesha", 'ebute metta', 'oyingbo', 'coker', 'aguda', 'orile', 'alaba suru', 'mosafejor', 'ajegunle', 'ojo road', 'mile 2', 'boundry', 'ijora', 'ijora badia', 'apapa'], fee: 2000 },
      { keywords: ['ikeja', 'maryland', 'ojota', 'magodo', 'gbagada', 'anthony','mile 12'], fee: 2500 },
      { keywords: ['festac', 'satellite', 'ojo', 'alaba'], fee: 3000 },
      { keywords: ['ikorodu', 'epe', 'badagry', 'agbara', 'yanaba'], fee: 3500 }
    ];
    
    // Check each area
    for (const area of areaRates) {
      if (area.keywords.some(keyword => addressLower.includes(keyword))) {
        console.log(`Address identified as ${area.keywords[0]}`);
        setDeliveryFee(area.fee);
        return;
      }
    }
    
    // Default rate if no area identified
    console.log("Could not identify specific area, using default rate");
    setDeliveryFee(3000);
  };

  // Enhanced isInLagosIsland function with more keywords
  const isInLagosIsland = (address) => {
    const lagosIslandKeywords = [
      'idumota', 'lagos island', 'marina', 'broad street', 'tinubu', 
      'obalende', 'cms', 'tbs', 'nnamdi azikiwe', 'adeniji adele',
      'dolphin estate', 'eko bridge', 'carter bridge', 'apongbon',
      'ita faji', 'oke arin', 'balogun', 'docemo', 'oluwole', 'martins'
    ];
    
    return lagosIslandKeywords.some(keyword => address.includes(keyword));
  };

  // Enhanced calculateDistance with better precision
  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };
  
  const validateAddress = (address) => {
    if (!address || address.trim().length < 10) {
      return "Please enter a more detailed address";
    }
    return null; // No error
  };
  
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  useEffect(() => {
    // Only calculate if an address is selected
    if (selectedAddress !== null && addressList.length > 0) {
      calculateDeliveryFee(addressList[selectedAddress]);
    }
  }, [selectedAddress, addressList]);

  const handleSelectAddress = (index) => {
    setSelectedAddress(index);
  };

  const handleAddAddress = () => {
    setShowAddressForm(!showAddressForm); // Toggle the form visibility
  };

  const handleSubmitNewAddress = () => {
    const addressError = validateAddress(newAddress);
    if (addressError) {
      Alert.alert("Invalid Address", addressError);
      return;
    }
    
    if (!newPhone || newPhone.trim().length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid phone number");
      return;
    }
    
    // Call API to add address
    addAddressToAPI();
  };

// Handle proceeding to next step with order and address details
const handleContinue = () => {
  if (selectedAddress === null) {
    Alert.alert("Select Address", "Please select a delivery address");
    return;
  }
  
  const selectedAddressData = addressList[selectedAddress];
  
  // Parse ordered items if it's a string
  let orderedItemsArray = typeof orderedItems === 'string' 
    ? JSON.parse(orderedItems || "[]") 
    : orderedItems || [];
  
  // Calculate service fee and total amount
  const calculatedServiceFee = parseFloat(totalAmount) * 0.01; // 1% of subtotal
  const calculatedTotalAmount = parseFloat(totalAmount) + deliveryFee + calculatedServiceFee;
  
  // Create the order object with the structure you want
  const orderWithDeliveryInfo = {
    items: orderedItemsArray,
    address: selectedAddressData.address,
    phoneNumber: selectedAddressData.phoneNumber,
    deliveryFee: deliveryFee,
    serviceFee: calculatedServiceFee,
    totalAmount: calculatedTotalAmount
  };
  
  console.log("Order with delivery info:", orderWithDeliveryInfo);
  
  // Pass the complete order data to the next screen
  onNext(orderWithDeliveryInfo);
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

  const orderedItemsArray = typeof orderedItems === 'string' 
    ? JSON.parse(orderedItems || "[]") 
    : orderedItems || [];
    
  const totalQuantity = orderedItemsArray.reduce((sum, item) => sum + item.quantity, 0);

  const serviceFee = parseFloat(totalAmount) * 0.01; // 1% of subtotal
  const calculatedTotalAmount = parseFloat(totalAmount) + deliveryFee + serviceFee;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }
console.log(orderedItems)
return (
  <ScrollView style={styles.mainn}>
    <Text style={styles.store}>Billing Address</Text>
    <View style={styles.otheradd}>
      {addressList.length > 0 ? (
        addressList.map((address, index) => (
          <TouchableOpacity
            style={styles.pettt}
            key={address._id || index}
            onPress={() => handleSelectAddress(index)}
          >
            <View style={styles.pound}>
              <View style={styles.iconz}>
                <EvilIcons name="location" size={24} color="black" />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.plat}>
                  {address.address && address.address.length > 33
                    ? `${address.address.substring(0, 33)}...`
                    : address.address || "Address not available"}
                </Text>
                <Text style={styles.phoneText}>
                  {address.phoneNumber || "No phone number"}
                </Text>
              </View>
            </View>
            <View style={styles.addressActions}>
              <TouchableOpacity 
                onPress={() => deleteAddress(address._id)}
                style={styles.deleteButton}
              >
                <MaterialIcons name="delete-outline" size={20} color="#FF0000" />
              </TouchableOpacity>
              <Text style={styles.radioContainer}>
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
        ))
      ) : (
        <View style={styles.noAddressContainer}>
          <Text style={styles.noAddressText}>No addresses found. Please add an address.</Text>
        </View>
      )}
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
          <Text style={styles.labell}>Address *</Text>
          <View style={{ marginTop: 8 }}>
            <TextInput
              style={styles.inputt}
              placeholder="Enter your full address"
              keyboardType="default"
              placeholderTextColor="#999"
              value={newAddress}
              onChangeText={(text) => setNewAddress(text)}
            />
          </View>
        </View>
        <View style={{ marginTop: 30 }}>
          <Text style={styles.labell}>Phone Number *</Text>
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
                {item.name ? item.name.replace(/-/g, " ") : "Unknown Item"}
              </Text>
            </View>
            <View>
              <Text style={styles.shish2}>
                {item.quantity} yards ( ₦
                {item.price ? item.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                }) : "0.00"}
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
          <Text style={styles.shish2}>₦{deliveryFee.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.sponner}>
        <View>
          <Text style={styles.shish2}>Service Fee</Text>
        </View>
        <View>
          <Text style={styles.shish2}>₦{serviceFee.toLocaleString(undefined, {
  minimumFractionDigits: 2,
})}</Text>
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
            Items will be delivered to the selected address. You will receive
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
        onPress={selectedAddress !== null ? handleContinue : null} // Enable or disable onPress
        disabled={selectedAddress === null} // Disable the button if no address is selected
      >
        <Text style={styles.first}>Proceed</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
);
}

const styles = StyleSheet.create({
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
loadingText: {
  fontSize: 16,
  fontFamily: "KumbhSans_500Medium",
},
errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
errorText: {
  fontSize: 16,
  color: '#FF0000',
  fontFamily: "KumbhSans_500Medium",
  textAlign: 'center',
},
noAddressContainer: {
  padding: 20,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E9E9E9',
  borderRadius: 16,
  marginBottom: 20,
},
noAddressText: {
  fontFamily: "KumbhSans_500Medium",
  fontSize: 14,
  color: '#666666',
  textAlign: 'center',
},
addressTextContainer: {
  flex: 1,
  paddingRight: 5,
},
addressActions: {
  flexDirection: 'row',
  alignItems: 'center',
},
deleteButton: {
  padding: 8,
  marginRight: 5,
},
phoneText: {
  fontFamily: "KumbhSans_400Regular",
  fontSize: 14,
  color: '#666666',
  marginTop: 2,
},
radioContainer: {
  height: "100%",
  flexDirection: "column",
  paddingTop: 8,
  alignItems: "center",
},
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
  padding: 15,
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
    marginTop: 30,
    marginBottom: 20,
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
    marginTop: 20,
  },
  pettt: {
    width: "100%",
    padding: 15,
    minHeight: 70,
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
    alignItems: "flex-start",
    flex: 1,
  },
  iconz: {
    marginRight: 7,
    paddingTop: 2,
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