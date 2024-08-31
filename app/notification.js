import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import ButtomNav from '../components/ButtomNav';
import { StatusBar } from 'expo-status-bar';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from '@expo-google-fonts/kumbh-sans';
import { useRouter } from 'expo-router';
import moment from 'moment';

export default function Notification() {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const notifications = [
    {
      type: 'package',
      title: 'Package delivered',
      message:
        'Items from your order 1234531 have been shipped and are expected to arrive.',
      date: '2024-06-16',
    },
    {
      type: 'delivery',
      title: 'Delivery is here',
      message:
        'Items from your order Senitor have been shipped and are expected to arrive.',
      date: '2024-06-16',
    },
    {
      type: 'delivery',
      title: 'Delivery is here!',
      message:
        'Items from your order 1234531 have been shipped and are expected to arrive.',
      date: '2024-06-15',
    },
    {
      type: 'shipped',
      title: 'Shipped',
      message:
        'Items from your order 1234531 have been shipped and are expected to arrive.',
      date: '2024-06-15',
    },
    {
      type: 'confirmed',
      title: 'Confirmed',
      message: 'Your order 1234531 has been confirmed.',
      date: '2024-06-14',
    },
    {
      type: 'new_arrival',
      title: 'New Arrivals are here!',
      message: 'Check out our latest design.',
      date: '2024-06-13',
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'package':
        return (
          <Ionicons name="calendar-number-outline" size={24} color="black" />
        );
      case 'delivery':
        return (
          <MaterialCommunityIcons
            name="truck-delivery-outline"
            size={24}
            color="black"
          />
        );
      case 'shipped':
        return <Feather name="box" size={24} color="black" />;
      case 'confirmed':
        return <Feather name="bookmark" size={24} color="black" />;
      case 'new_arrival':
        return <AntDesign name="staro" size={24} color="black" />;
      default:
        return null;
    }
  };

  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((groups, notification) => {
      const date = moment(notification.date).format('YYYY-MM-DD');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  };

  const groupedNotifications = groupNotificationsByDate(notifications);
  const today = moment().format('YYYY-MM-DD');

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.storeview}>
        <View style={styles.movearrow}>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.noteflex}>
          <Text style={styles.store}>Notification</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          {Object.keys(groupedNotifications).map((date, index) => (
            <View key={index} style={{ marginTop: 20 }}>
              <Text style={styles.dates}>
                {date === today
                  ? 'Today'
                  : moment(date).format('MMMM Do, YYYY')}
              </Text>
              <View style={{ marginTop: 30 }}>
                {groupedNotifications[date].map((notification, index) => (
                  <TouchableOpacity key={index} style={styles.pushs}>
                    <View style={styles.circles}>
                      {getIcon(notification.type)}
                    </View>
                    <View style={{ width: '80%' }}>
                      <Text style={styles.notehead}>{notification.title}</Text>
                      <Text style={styles.rest}>{notification.message}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <ButtomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0,
    paddingTop: 100,
  },
  main: {
    padding: 15,
    flex: 1,
  },
  dates: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 14,
    color: '#888888',
  },
  pushs: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  circles: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notehead: {
    fontFamily: 'KumbhSans_500Medium',
    color: '#2E2E2E',
    fontSize: 18,
  },
  rest: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#797979',
    fontSize: 14,
    marginTop: 6,
  },
  storeview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 15,
    paddingTop: 45,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  movearrow: {
    marginLeft: 30,
  },
  noteflex: {
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  store: {
    fontFamily: 'KumbhSans_400Regular',
    color: '#000000',
    fontSize: 40,
  },
});
