/** @format */

// app/LoadingContext.js
import React, { createContext, useState, useContext } from "react";

// Create a Context for the loading state
const LoadingContext = createContext();

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for using the loading context
export const useLoading = () => useContext(LoadingContext);
export default LoadingProvider;
