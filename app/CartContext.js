import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.name === item.name
      );

      if (existingItemIndex > -1) {
        // Item already exists in the cart, increase quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          price: calculatePrice(existingItem.basePrice, newQuantity),
        };
        return updatedItems;
      } else {
        // Item does not exist in the cart, add as new item
        return [...prevItems, item];
      }
    });
  };

  const updateItemQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName
          ? {
              ...item,
              quantity: newQuantity,
              price: calculatePrice(item.basePrice, newQuantity),
            }
          : item
      )
    );
  };

  const removeFromCart = (itemName) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.name !== itemName)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculatePrice = (basePrice, quantity) => {
    const priceNumber = parseFloat(basePrice.replace('$', ''));
    if (quantity > 5) {
      return `$${(priceNumber / 5) * quantity}`;
    }
    return `$${priceNumber * (quantity / 5)}`;
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.price.replace('$', ''));
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        clearCart,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
