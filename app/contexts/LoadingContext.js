// app/LoadingContext.js
import React, { createContext, useState, useContext, useMemo } from "react";

// Create a Context for the loading state
const LoadingContext = createContext();

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Define these functions outside of the useMemo to avoid recreation
  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => {
    return { loading, showLoading, hideLoading };
  }, [loading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// Create a custom hook for using the loading context
export const useLoading = () => useContext(LoadingContext);
export default LoadingProvider;