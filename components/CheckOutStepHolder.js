import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CheckOutStep from './CheckOutStep';

export default function CheckOutStepHolder({ totalAmount, numberOfItems, orderedItems }) {
  // State to manage the current step
  const [currentStep, setCurrentStep] = useState('Billing');

  // Function to handle changing steps
  const handleStepChange = (step) => {
    // Allow going back to "Billing" from any step but not forward from "Billing"
    if (
      (currentStep === 'PaymentMethod' && step === 'Billing') ||
      (currentStep === 'Review' &&
        (step === 'Billing' || step === 'PaymentMethod'))
    ) {
      setCurrentStep(step);
    }
  };

  // Render the indicators with click functionality
  return (
    <View>
      <View style={styles.indicatorHolder}>
        {/* Indicator for Billing */}
        <TouchableOpacity onPress={() => handleStepChange('Billing')}>
          <View
            style={[
              styles.indicator,
              currentStep === 'Billing'
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        </TouchableOpacity>

        {/* Indicator for PaymentMethod */}
        <TouchableOpacity onPress={() => handleStepChange('PaymentMethod')}>
          <View
            style={[
              styles.indicator,
              currentStep === 'PaymentMethod'
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        </TouchableOpacity>

        {/* Indicator for Review */}
        <TouchableOpacity onPress={() => handleStepChange('Review')}>
          <View
            style={[
              styles.indicator,
              currentStep === 'Review'
                ? styles.activeIndicator
                : styles.inactiveIndicator,
            ]}
          />
        </TouchableOpacity>
      </View>

      <View>
        {/* Pass currentStep and handleStepChange to CheckOutStep */}
        <CheckOutStep
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          totalAmount={totalAmount}
          numberOfItems={numberOfItems}
          orderedItems={orderedItems}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  indicator: {
    width: 100,
    height: 4,
    borderRadius: 29,
  },
  activeIndicator: {
    backgroundColor: 'black', // Active step indicator color
  },
  inactiveIndicator: {
    backgroundColor: '#D9D9D9', // Inactive step indicator color
  },
});
