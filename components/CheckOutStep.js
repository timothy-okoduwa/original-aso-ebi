/** @format */

import { View, StyleSheet } from "react-native";
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
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Function to move to the next step
  const handleNext = (orderData) => {
    if (currentStep === "Billing") {
      // Store the entire order data object
      setOrderDetails(orderData);
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
          orderDetails={orderDetails}
          totalAmount={orderDetails?.totalAmount || 0}
          numberOfItems={numberOfItems}
          orderedItems={orderDetails?.items || orderedItems}
          totalQuantity={orderDetails?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    marginTop: 20,
  },
});