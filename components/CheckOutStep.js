/** @format */

import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Billing from "./Billing";
import PaymentMethod from "./PaymentMethod";

export default function CheckOutStep({
  currentStep,
  onStepChange,
  totalAmount,
  numberOfItems,
  orderedItems,
}) {
  const [calculatedTotalAmount, setCalculatedTotalAmount] = useState(0);
  // Function to move to the next step
  const handleNext = (amount) => {
    if (currentStep === "Billing") {
      setCalculatedTotalAmount(amount); // Set the calculated amount
      onStepChange("PaymentMethod");
    } else if (currentStep === "PaymentMethod") {
      onStepChange("Review");
    }
  };

  return (
    <View style={styles.main}>
      {/* Conditionally render components based on the current step */}
      {currentStep === "Billing" && (
        <Billing
          onNext={handleNext}
          totalAmount={totalAmount}
          numberOfItems={numberOfItems}
          orderedItems={orderedItems}
        />
      )}
      {currentStep === "PaymentMethod" && (
        <PaymentMethod
          onNext={handleNext}
          totalAmount={calculatedTotalAmount}
          numberOfItems={numberOfItems}
          orderedItems={orderedItems}
        />
      )}
      {/* Add more steps if necessary */}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
  },
});
