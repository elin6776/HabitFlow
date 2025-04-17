import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { fetchUser } from "../../src/firebase/firebaseCrud";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import flowerImage from "../../assets/images/flower.jpeg";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUser();
        setUserData(data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, []);

  const handleCopy = () => {
    Clipboard.setStringAsync(userData?.uid || "");
    setCopied(true);
    fadeAnim.setValue(1);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => setCopied(false));
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 30 }} />
      <Text style={styles.username}>{userData?.username}</Text>
      <View style={{ height: 20 }} />

      <Image source={flowerImage} style={styles.profileImage} />

      <View style={styles.row}>
        <Text style={styles.text}>Points: </Text>
        <Text style={styles.styledtext}>{userData?.points}</Text>
      </View>

      <View style={{ height: 20 }} />
      <View style={styles.row}>
        <Text style={styles.text}>UID: </Text>
        <Text style={styles.styledtext}>{userData?.uid}</Text>
        <TouchableOpacity onPress={handleCopy} style={styles.iconButton}>
          <Ionicons name="copy-outline" size={24} color="#A3BF80" />
        </TouchableOpacity>
      </View>

      {copied && (
        <Animated.View style={[styles.copiedPopup, { opacity: fadeAnim }]}>
          <Text style={styles.copiedText}>Copied!</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
    padding: 20,
  },
  username: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
  },
  styledtext: {
    backgroundColor: "white",
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginLeft: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  iconButton: {
    marginLeft: 10,
    alignSelf: "center",
  },
  copiedPopup: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#086922",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 5,
  },
  
  copiedText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
