/** @format */
import React, { useState, useEffect } from "react";
import {
  View,
  Animated,
  StyleSheet,
  RefreshControl,
  ScrollView,
  ViewStyle,
  Text,
  Easing,
} from "react-native";

// Types
interface SpinnerProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

interface SkeletonProps {
  width?: number | `${number}%` | "auto"; // Updated width type
  height?: number;
  style?: ViewStyle;
  color?: string;
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  color?: string;
}

// Circular Spinner Component
export const Spinner: React.FC<SpinnerProps> = ({
  size = 24,
  color = "#3843D0",
  style,
}) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.spinnerContainer, style]}>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: size / 10,
            borderColor: color,
            transform: [{ rotate: spin }],
          },
          styles.spinner,
        ]}
      />
    </View>
  );
};

// Skeleton Loading Component
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = 20,
  style,
  color = "#E5E7EB",
}) => {
  const opacity = new Animated.Value(0.3);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Handle width type conversion
  const getWidthStyle = (width: SkeletonProps["width"]) => {
    if (typeof width === "number") {
      return width;
    }
    // For percentage values or "auto"
    return width;
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: getWidthStyle(width),
          height,
          opacity,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

// Pull to Refresh Component
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  color = "#3843D0",
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={color}
          colors={[color]}
        />
      }
    >
      {children}
    </ScrollView>
  );
};

// Example Skeleton Layout Component
export const SkeletonLayout: React.FC<{ color?: string }> = ({ color }) => {
  return (
    <View style={styles.skeletonLayout}>
      {/* Header Skeleton */}
      <Skeleton height={40} style={styles.marginBottom} color={color} />

      {/* Content Skeletons */}
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.skeletonRow}>
          <Skeleton
            width={60}
            height={60}
            style={styles.skeletonAvatar}
            color={color}
          />
          <View style={styles.skeletonContent}>
            <Skeleton
              width="80%"
              height={20}
              style={styles.marginBottom}
              color={color}
            />
            <Skeleton width="60%" height={16} color={color} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  skeletonLayout: {
    padding: 16,
  },
  skeletonRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  skeletonAvatar: {
    borderRadius: 30,
    marginRight: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: "center",
  },
  marginBottom: {
    marginBottom: 8,
  },
});
