import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
  fcmToken?: string;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [fcmToken, setFcmToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get Push token");
        return;
      }

      // Get Expo push token
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0000009a',
        });
      }
      
      return token;
    } else {
      console.log("ERROR: please use a physical device");
    }
  }

  // Function to get the FCM token from Expo push token
  const getFCMToken = async (expoToken: Notifications.ExpoPushToken): Promise<string | null> => {
    try {
      // Only attempt to get native FCM token when NOT in Expo Go
      if (Device.isDevice && Constants.appOwnership !== 'expo') {
        try {
          // This will only work in standalone apps or dev clients
          const fcmToken = await Notifications.getDevicePushTokenAsync();
          console.log("Native FCM token:", fcmToken.data);
          return fcmToken.data;
        } catch (tokenError) {
          console.error("Error getting device push token:", tokenError);
          // Fallback to returning the Expo token
          return expoToken.data;
        }
      } else {
        // In Expo Go, you must use Expo's push service
        console.log("Using Expo push token:", expoToken.data);
        return expoToken.data; // Return full Expo token for use with Expo's push service
      }
    } catch (error) {
      console.error("Error getting FCM token:", error);
      return null;
    }
  };

  useEffect(() => {
    registerForPushNotificationAsync().then(async (token) => {
      if (token) {
        setExpoPushToken(token);
        
        // Get the FCM token from the Expo token
        const firebaseToken = await getFCMToken(token);
        if (firebaseToken) {
          setFcmToken(firebaseToken);
          console.log("FCM Token:", firebaseToken);
        }
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
    fcmToken,
  };
};