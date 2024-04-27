import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

import { useFonts, Ledger_400Regular } from '@expo-google-fonts/ledger';
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { Octicons, Entypo, MaterialIcons } from '@expo/vector-icons';

// import {  } from '@expo/vector-icons';
import data from './data';
export default function DetailsDescription({ partName }) {
  const [quantity, setQuantity] = useState(5);
  const [addedToCart, setAddedToCart] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Ledger_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  //   if (!fontsLoaded || fontError) {
  //     return null;
  //   }
  const fabric = data?.find((item) => item?.name === partName);
  const handleIncrement = () => {
    if (quantity >= 5) {
      setQuantity((prevQuantity) => prevQuantity + 5); // Increment by 5 from 5 onwards
    } else {
      setQuantity((prevQuantity) => prevQuantity + 1); // Increment by 1 until reaching 5
    }
  };

  const handleDecrement = () => {
    if (quantity > 5) {
      setQuantity((prevQuantity) => prevQuantity - 5); // Decrement by 5 if quantity is greater than 5
    } else if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Decrement by 1 until reaching 1 from 5
    }
  };

  const handleAddToCart = () => {
    setAddedToCart(true); // Set addedToCart to true when added to cart
  };

  if (fabric) {
    return (
      <View style={styles.main}>
        <Text style={styles.fabname}>{fabric.name}</Text>
        <View>
          <Text style={styles.desc}>{fabric.details}</Text>
          <Text style={styles.price}>{fabric.price}</Text>
        </View>
        <View style={styles.nerd}>
          <Text style={styles.note}>
            Note: Quantity is in yards. Minimum quantity is 1 yard.
          </Text>
        </View>
        <View style={styles.incc}>
          <TouchableOpacity style={styles.incbut} onPress={handleDecrement}>
            <Text style={styles.incone}>
              <Octicons name="dash" size={18} color="#000000" />
            </Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.mount}>{quantity}</Text>
          </View>
          <TouchableOpacity style={styles.incbut} onPress={handleIncrement}>
            <Text style={styles.incone}>
              <Entypo name="plus" size={18} color="#000000" />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.addtoc}>
          {addedToCart ? (
            <TouchableOpacity style={styles.added}>
              <Text style={{ color: '#767676' }}>Added to Cart </Text>
              <Text>
                <MaterialIcons
                  name="check-circle-outline"
                  size={20}
                  color="#767676"
                />
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.create} onPress={handleAddToCart}>
              <Text style={{ color: 'white' }}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  } else {
    return <Text>Fabric not found</Text>;
  }
}
const styles = StyleSheet.create({
  main: {
    marginTop: 13,
  },
  cold: {
    marginTop: 15,
    flexDirection: 'row',
  },
  colorBlock: {
    backgroundColor: '#042D25',
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  fabname: {
    fontSize: 23,
    fontFamily: 'Ledger_400Regular',
    marginTop: 6,
    lineHeight: 27,
  },
  desc: {
    marginTop: 13,
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    // lineHeight: 18,

    color: '#000000',
  },
  price: {
    fontSize: 23,
    fontFamily: 'Ledger_400Regular',
    marginTop: 20,
    lineHeight: 27,
    color: '#2E2E2E',
  },
  nerd: {
    marginTop: 30,
    height: 56,
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  note: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    lineHeight: 17,

    color: '#000000',
  },
  incc: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  incbut: {
    width: 45,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add border width
    borderColor: '#DCDCDC', // Add border color
  },
  incone: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
  },
  mount: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
    color: '#000000',
  },
  addtoc: {
    marginTop: 30,
  },
  create: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 55,
    backgroundColor: '#000000',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  added: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 55,
    backgroundColor: '#ffffff',
    color: '#767676',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1, // Add border width
    borderColor: '#767676', // Add border color
  },
});
