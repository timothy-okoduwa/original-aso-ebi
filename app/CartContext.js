/** @format */

import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.categoryTitle === item.categoryTitle
      );

      if (existingItemIndex > -1) {
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
        return [
          ...prevItems,
          { ...item, price: calculatePrice(item.basePrice, item.quantity) },
        ];
      }
    });
  };

  const updateItemQuantity = (categoryTitle, newQuantity) => {
    if (newQuantity < 5) return; // Minimum 5 yards
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.categoryTitle === categoryTitle
          ? {
              ...item,
              quantity: newQuantity,
              price: calculatePrice(item.basePrice, newQuantity),
            }
          : item
      )
    );
  };

  const removeFromCart = (categoryTitle) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.categoryTitle !== categoryTitle)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculatePrice = (basePrice, quantity) => {
    // Ensure basePrice is a number
    const price =
      typeof basePrice === "string"
        ? parseFloat(basePrice.replace(/[^0-9.]/g, ""))
        : basePrice;

    if (quantity === 5) {
      return price; // Return base price for minimum quantity
    } else {
      return price * (quantity / 5); // Multiply proportionally for higher quantities
    }
  };

  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
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
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
