import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ButtomNav from '../../components/ButtomNav';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');
      
      if (!userId || !token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://oae-be.onrender.com/api/oae/notification/notifications/${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Format notifications to match the expected structure
        const formattedNotifications = result.data.notifications.map(notification => ({
          type: getNotificationType(notification.title),
          title: notification.title,
          message: notification.message,
          date: moment(notification.createdAt).format('YYYY-MM-DD'),
        }));
        setNotifications(formattedNotifications);
      } else {
        setError(result.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError('Error fetching notifications: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationType = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('pending')) return 'pending';
    if (titleLower.includes('confirmed')) return 'confirmed';
    if (titleLower.includes('processing') || titleLower.includes('processed')) return 'processing';
    if (titleLower.includes('shipped') || titleLower.includes('on the way')) return 'shipped';
    if (titleLower.includes('delivered')) return 'delivered';
    return 'other'; // Default type
  };

  if (!fontsLoaded || fontError) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'pending':
        return <MaterialIcons name="pending-actions" size={24} color="black" />;
      case 'confirmed':
        return <Feather name="bookmark" size={24} color="black" />;
      case 'processing':
        return <Ionicons name="calendar-number-outline" size={24} color="black" />;
      case 'shipped':
        return <Feather name="box" size={24} color="black" />;
      case 'delivered':
        return <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="black" />;
      default:
        return <AntDesign name="notification" size={24} color="black" />;
    }
  };

  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((groups, notification) => {
      const date = notification.date;
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={fetchNotifications}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AntDesign name="inbox" size={50} color="#888888" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          ) : (
            Object.keys(groupedNotifications)
              .sort((a, b) => moment(b).diff(moment(a))) // Sort dates in descending order
              .map((date, index) => (
                <View key={index} style={{ marginTop: 20 }}>
                  <Text style={styles.dates}>
                    {date === today
                      ? 'Today'
                      : moment(date).format('MMMM Do, YYYY')}
                  </Text>
                  <View style={{ marginTop: 30 }}>
                    {groupedNotifications[date].map((notification, idx) => (
                      <TouchableOpacity key={idx} style={styles.pushs}>
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
              ))
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    fontFamily: 'KumbhSans_400Regular',
    marginTop: 10,
    color: '#888888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  errorText: {
    fontFamily: 'KumbhSans_400Regular',
    color: 'red',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryText: {
    fontFamily: 'KumbhSans_500Medium',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontFamily: 'KumbhSans_400Regular',
    fontSize: 16,
    color: '#888888',
    marginTop: 15,
  },
});