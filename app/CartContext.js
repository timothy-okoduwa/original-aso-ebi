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
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + item.quantity;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          price: calculatePrice(existingItem.basePrice, newQuantity), // Store as numeric
        };
        return updatedItems;
      } else {
        return [
          ...prevItems,
          { ...item, price: calculatePrice(item.basePrice, item.quantity) },
        ]; // Add numeric price
      }
    });
  };

  const updateItemQuantity = (itemName, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.name === itemName
          ? {
              ...item,
              quantity: newQuantity,
              price: calculatePrice(item.basePrice, newQuantity), // Store as numeric
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
    const priceNumber = parseFloat(
      basePrice.replace('₦', '').replace(/,/g, '')
    );
    const totalPrice =
      quantity > 5
        ? (priceNumber / 5) * quantity
        : priceNumber * (quantity / 5);
    return totalPrice; // Return numeric value
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price; // Now this is numeric
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
