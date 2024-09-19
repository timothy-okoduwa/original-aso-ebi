import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Billing from './Billing';
import PaymentMethod from './PaymentMethod';

export default function CheckOutStep({ currentStep, onStepChange }) {
  // Function to move to the next step
  const handleNext = () => {
    if (currentStep === 'Billing') {
      onStepChange('PaymentMethod');
    } else if (currentStep === 'PaymentMethod') {
      onStepChange('Review');
    }
  };

  return (
    <View style={styles.main}>
      {/* Conditionally render components based on the current step */}
      {currentStep === 'Billing' && <Billing onNext={handleNext} />}
      {currentStep === 'PaymentMethod' && <PaymentMethod onNext={handleNext} />}
      {/* Add more steps if necessary */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
  },
});
