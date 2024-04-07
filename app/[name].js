import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import ButtomNav from '../components/ButtomNav';
import DetailsImage from '../components/DetailsImage';
import Colors from '../components/Colors';
import { usePathname } from 'expo-router';
import DetailsDescription from '../components/DetailsDescription';

export default function detailspage() {
  const pathname = usePathname();
  const partName = pathname.substring(1);
  console.log(partName);
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <DetailsImage partName={partName} />
          <View style={styles.main}>
            <Colors partName={partName} />
            <DetailsDescription partName={partName} />
          </View>
        </View>
      </ScrollView>
      <ButtomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 0, // Adjust this value to accommodate the height of your ButtomNav component
  },
  main: {
    padding: 15,

    flex: 1,
  },
});
