// app/LoadingIndicator.js
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoading } from './LoadingContext';

const LoadingIndicator = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});

export default LoadingIndicator;
