import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { useFonts, Ledger_400Regular } from '@expo-google-fonts/ledger';
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { Octicons, Entypo } from '@expo/vector-icons';
import data from './data';
import { CartContext } from '../app/CartContext';

export default function DetailsDescription({ partName }) {
  const [quantity, setQuantity] = useState(5);
  const [added, setAdded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Ledger_400Regular,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  const { addToCart, cartItems } = useContext(CartContext);

  const fabric = data?.find((item) => item?.name === partName);

  // Check if item is already in cart on mount or when cartItems/partName changes
  useEffect(() => {
    const isItemInCart = cartItems.some((item) => item.name === partName);
    setAdded(isItemInCart);
  }, [cartItems, partName]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) =>
      prevQuantity >= 5 ? prevQuantity + 5 : prevQuantity + 1
    );
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 5 ? prevQuantity - 5 : Math.max(1, prevQuantity - 1)
    );
  };

  const calculatePrice = (basePrice, quantity) => {
    const priceNumber = parseFloat(
      basePrice.replace('₦', '').replace(/,/g, '')
    ); // Remove currency and commas
    let totalPrice;

    if (quantity > 5) {
      totalPrice = (priceNumber / 5) * quantity;
    } else {
      totalPrice = priceNumber * (quantity / 5);
    }

    return `₦${totalPrice.toLocaleString()}`; // Format the total price with commas
  };

  const handleAddToCart = () => {
    const updatedPrice = calculatePrice(fabric.price, quantity);
    addToCart({
      ...fabric,
      quantity,
      basePrice: fabric.price,
      price: updatedPrice,
    });
    setAdded(true);
  };

  if (fontError || !fontsLoaded) {
    return null;
  }

  if (fabric) {
    return (
      <View style={styles.main}>
        <Text style={styles.fabname}>{fabric.name.replace(/-/g, ' ')}</Text>
        <View>
          <Text style={styles.desc}>{fabric.details}</Text>
          <Text style={styles.price}>
            {calculatePrice(fabric.price, quantity)}
          </Text>
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
          <TouchableOpacity
            style={[styles.create, added && styles.added]}
            onPress={handleAddToCart}
            disabled={added} // Disable button if item is already added
          >
            <Text style={[styles.first, added && styles.sec]}>
              {added ? 'Added to Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
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
  first: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'KumbhSans_500Medium',
  },
  sec: {
    color: '#767676',
    fontSize: 16,
    fontFamily: 'KumbhSans_500Medium',
  },
});
