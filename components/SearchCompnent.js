import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useFonts,
  KumbhSans_100Thin,
  KumbhSans_200ExtraLight,
  KumbhSans_300Light,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
  KumbhSans_900Black,
} from '@expo-google-fonts/kumbh-sans';

export default function SearchComponent({ setSearchQuery }) {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchQuery(''); // Set empty string as the search query if search text is empty
    }
  }, [searchText]);

  const handleSearch = () => {
    setSearchQuery(searchText);
  };

  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_100Thin,
    KumbhSans_200ExtraLight,
    KumbhSans_300Light,
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
    KumbhSans_900Black,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <View style={styles.mainhead}>
      <View style={styles.flexes}>
        <View style={styles.forsearch}>
          <TextInput
            style={styles.inputt}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            keyboardType="default"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.hanging}>
          <TouchableOpacity style={styles.create} onPress={handleSearch}>
            <Text style={{ color: 'white' }}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.love}>
          <TouchableOpacity style={styles.create2}>
            <Text>
              <Feather name="heart" size={24} color="black" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainhead: {
    marginTop: 30,
  },
  flexes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forsearch: {
    width: '60%',
  },
  hanging: {
    width: '23%',
  },
  love: {
    width: '13%',
  },
  inputt: {
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
  },
  create: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
  },
  create2: {
    fontFamily: 'KumbhSans_500Medium',
    width: '100%',
    height: 50,
    borderColor: '#D7D8DB',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'transparent',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
  },
});
