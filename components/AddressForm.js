import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import axios from 'axios';

// Custom Nominatim Autocomplete Component
const NominatimAutocomplete = ({ onSelectAddress }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Debounce function to prevent too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 3) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  const fetchSuggestions = async (searchText) => {
    if (!searchText) return;
    
    setLoading(true);
    try {
      // Using Nominatim OSM API
      // Adding viewbox parameter to focus on Nigeria area
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=ng&limit=5&addressdetails=1&viewbox=2.0,4.0,15.0,14.0`
      );
      
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectItem = (item) => {
    // Send the full item back to the parent component
    onSelectAddress({
      fullAddress: item.display_name,
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      },
      addressComponents: item.address
    });
    
    // Update the search box with the selected address
    setQuery(item.display_name);
    // Clear suggestions after selection
    setSuggestions([]);
  };
  
  return (
    <View style={styles.autocompleteContainer}>
      <TextInput
        style={styles.inputt}
        placeholder="Search for your address"
        value={query}
        onChangeText={setQuery}
        placeholderTextColor="#999"
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
      
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectItem(item)}
            >
              <Text style={styles.suggestionText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// Modified address form section using the custom component
const AddressForm = ({ showAddressForm, handleSubmitNewAddress, newPhone, setNewPhone, newPostal, setNewPostal, newZip, setNewZip }) => {
  const [newAddress, setNewAddress] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  
  const handleAddressSelect = (addressData) => {
    setNewAddress(addressData.fullAddress);
    setSelectedCoordinates(addressData.coordinates);
    
    // You can also extract postal code from addressData.addressComponents if available
    if (addressData.addressComponents.postcode) {
      setNewPostal(addressData.addressComponents.postcode);
    }
  };
  
  const handleSubmit = () => {
    // Include the coordinates with the address submission
    handleSubmitNewAddress(newAddress, newPhone, newPostal, newZip, selectedCoordinates);
  };
  
  return (
    <View style={styles.inputs}>
      <View style={{ marginTop: 10 }}>
        <Text style={styles.labell}>Address</Text>
        <View style={{ marginTop: 8 }}>
          <NominatimAutocomplete onSelectAddress={handleAddressSelect} />
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
            },
          ]}
          onPress={handleSubmit}
          disabled={!newAddress || !newPhone}
        >
          <Text style={styles.first}>Add Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Additional styles for the autocomplete component
const additionalStyles = StyleSheet.create({
  autocompleteContainer: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
  },
  suggestionsList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'KumbhSans_400Regular',
  },
  loadingContainer: {
    position: 'absolute',
    right: 10,
    top: 15,
    zIndex: 3
  }
});

// Merge the new styles with your existing styles
const styles = {
  ...StyleSheet.create({
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
  }),
  ...additionalStyles
};