import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useContext } from 'react';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { Image } from 'react-native';
import a from '../constants/image/sen2.png';
import { useRouter } from 'expo-router';
import {
  Octicons,
  Entypo,
  MaterialCommunityIcons,
  Ionicons,
} from '@expo/vector-icons';
import { CartContext } from '../app/CartContext';

export default function CartItems() {
  const router = useRouter();
  const {
    cartItems,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
  } = useContext(CartContext);
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.cartt}>
        <View style={styles.circle}>
          <Ionicons name="cart-outline" size={74} color="#000000" />
        </View>
        <View>
          <Text style={styles.empty}>Cart is Empty</Text>
        </View>
        <View>
          <Text style={styles.once}>
            Once you add items to your cart, you'll find them displayed here.
          </Text>
        </View>
      </View>
    );
  }

  const handleIncrement = (item) => {
    const newQuantity =
      item.quantity >= 5 ? item.quantity + 5 : item.quantity + 1;
    updateItemQuantity(item.name, newQuantity);
  };

  const handleDecrement = (item) => {
    const newQuantity =
      item.quantity > 5 ? item.quantity - 5 : Math.max(1, item.quantity - 1);
    updateItemQuantity(item.name, newQuantity);
  };

  const handleDelete = (itemName) => {
    removeFromCart(itemName);
  };

  const handleClearCart = () => {
    clearCart();
  };
  const handleCheckOut = () => {
    const totalAmount = getTotalAmount(); // Get the total amount

    // Calculate the total number of unique items
    const numberOfItems = cartItems.length;

    // Create an array of item names and quantities
    const orderedItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    router.push({
      pathname: '/checkout',
      params: {
        totalAmount,
        numberOfItems,
        orderedItems: JSON.stringify(orderedItems), // Pass the ordered items
      },
    });
  };
  const formatPrice = (price) => {
    return `₦${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <View>
      <View>
        <Text style={styles.summary}>Cart Summary</Text>
      </View>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.holderr}>
          <View>
            <View style={styles.imageHolder}>
              <Image
                style={styles.image}
                source={item.image || a}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.prices}>
            <View>
              <View>
                <Text style={styles.namez}>{item.name.replace(/-/g, ' ')}</Text>
              </View>
              <View>
                <Text style={styles.amont}>
                  ₦
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View>
                <Text style={styles.qty}>Qty: {item.quantity} yards</Text>
              </View>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.incbut}
                onPress={() => handleDecrement(item)}
              >
                <Text style={styles.incone}>
                  <Octicons name="dash" size={18} color="#000000" />
                </Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.mount}>{item.quantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.incbut}
                onPress={() => handleIncrement(item)}
              >
                <Text style={styles.incone}>
                  <Entypo name="plus" size={18} color="#000000" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.delete}>
            <TouchableOpacity
              style={styles.gaddle}
              onPress={() => handleDelete(item.name)}
            >
              <Text>
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={24}
                  color="#FB5D5D"
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <View style={styles.pop}>
        <Text style={styles.total}>Total: {formatPrice(getTotalAmount())}</Text>
      </View>
      <View style={styles.flux}>
        <TouchableOpacity style={styles.create} onPress={handleCheckOut}>
          <Text style={styles.first}>Checkout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.added} onPress={handleClearCart}>
          <Text style={styles.sec}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pop: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 60,
  },
  total: {
    fontSize: 25,
    fontFamily: 'KumbhSans_500Medium',
    color: '#000000',
  },
  added: {
    width: '100%',
    height: 55,
    backgroundColor: '#ffffff',
    color: '#767676',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,

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
  flux: {
    backgroundColor: 'white',
    marginTop: 50,
  },

  summary: {
    marginTop: 30,
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 20,
    lineHeight: 19,
    textAlign: 'left',
    color: '#000000',
  },
  holderr: {
    marginTop: 50,
    // backgroundColor: 'green',
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  imageHolder: {
    height: 100, // Adjust card height as needed
    width: 100, // Set width to 48% to accommodate two cards in a row with some space between them
    borderRadius: 3.12,
    overflow: 'hidden',
    // backgroundColor: 'red',
  },
  image: {
    width: '100%',
    flex: 1,
  },
  prices: {
    marginLeft: 20,
    width: '40%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  namez: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
  },
  amont: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
    marginTop: 10,
  },
  qty: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 18,
    lineHeight: 17.36,
    textAlign: 'left',
    color: '#2E2E2E',
    marginTop: 10,
  },
  counter: {
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  incone: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
  },
  incbut: {
    width: 29,
    height: 26,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add border width
    borderColor: '#DCDCDC', // Add border color
  },
  gaddle: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#D2D2D233',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Add border width
    borderColor: '#DCDCDC', // Add border color
  },
  mount: {
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 13,
    color: '#000000',
  },
  delete: {
    // marginLeft: 80,
    flex: 1,

    alignItems: 'flex-end',
  },
  cartt: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 146,
    height: 146,
    backgroundColor: '#F9F9F9',
    borderRadius: 73,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    marginTop: 20,
    fontFamily: 'KumbhSans_500Medium',
    fontSize: 20,
    color: '#000000',
  },
  once: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 18,
    marginTop: 10,
    width: 250,
    textAlign: 'center',
  },
});
