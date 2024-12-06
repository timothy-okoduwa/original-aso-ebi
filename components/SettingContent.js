/** @format */

import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  useFonts,
  KumbhSans_400Regular,
  KumbhSans_500Medium,
} from "@expo-google-fonts/kumbh-sans";
import p from "../constants/image/profile.png";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
export default function SettingContent({ userName }) {
  const router = useRouter();
  const [fontsLoaded, fontError] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }
  const logout = () => {
    router.push("/login");
  };
  const editprofile = () => {
    router.push("/editprofile");
  };
  const forgetpassword = () => {
    router.push("/forgetpassword");
  };
  return (
    <View>
      <View style={styles.imagestuff}>
        <View style={styles.flexer}>
          <View style={styles.setimage}>
            <Image source={p} style={styles.image} resizeMode="cover" />
          </View>
          <View style={{ marginTop: "14" }}>
            <Text style={styles.names}>
              {userName ? userName : "Demi Bankole"}
            </Text>
          </View>
          <View style={{ marginTop: "14" }}>
            <TouchableOpacity style={styles.update}>
              <Text style={styles.updatetext}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ marginTop: "30" }}>
        <View>
          <Text style={styles.othset}>Settings</Text>
        </View>
        <TouchableOpacity
          style={{ marginTop: "50", width: "100%" }}
          onPress={editprofile}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <FontAwesome5 name="user-circle" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Edit Profile</Text>
                <Text style={styles.ed2}>Update your profile</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: "50", width: "100%" }}
          onPress={forgetpassword}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="password" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Change Password</Text>
                <Text style={styles.ed2}>Update your password here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: "50", width: "100%" }}
          onPress={logout}
        >
          <View style={styles.flexer2}>
            <View style={styles.fiue}>
              <View style={styles.roundz}>
                <MaterialIcons name="logout" size={20} color="black" />
              </View>
              <View>
                <Text style={styles.editt}>Log out</Text>
                <Text style={styles.ed2}>Log out of your account here</Text>
              </View>
            </View>
            <View>
              <View>
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={20}
                  color="black"
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imagestuff: {
    width: "100%",
    // height: 200,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    marginTop: 30, // Use a number instead of a string
  },
  flexer: {
    justifyContent: "center", // Centers content vertically inside the flexer
    alignItems: "center", // Centers content horizontally inside the flexer
    width: "60%",

    padding: 10, // Add padding to better fit the content
  },
  setimage: {
    width: "100",
    height: "100",
    borderRadius: 50,
  },
  image: {
    width: "100%", // Matches the parent View's width
    height: "100%", // Matches the parent View's height
    borderRadius: 50,
  },
  names: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
    color: "#2E2E2E",
  },
  update: {
    width: "123",
    height: "41",
    borderRadius: "9",
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  updatetext: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
  othset: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 18,
    color: "#2E2E2E",
  },
  fiue: {
    flexDirection: "row",
    alignItems: "center",
    gap: "10",
  },
  flexer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  roundz: {
    width: "37.56",
    height: "37.56",
    borderRadius: "50%",
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  editt: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 16,
    color: "#000000",
  },
  ed2: {
    fontFamily: "KumbhSans_400Regular",
    fontSize: 19,
    color: "#888888",
  },
});
