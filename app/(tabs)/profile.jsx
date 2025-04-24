import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  FlatList,
} from "react-native";
import {
  fetchUser,
  updateUserPhoto,
  fetchCompletedChallenges,
} from "../../src/firebase/firebaseCrud";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [copied, setCopied] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [completedTasks, setCompletedTasks] = useState([]);
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });

    if (
      !result.didCancel &&
      result.assets &&
      result.assets.length > 0 &&
      userData
    ) {
      const asset = result.assets[0];
      const { uri, fileName } = asset;

      try {
        if (
          userData?.photoUrl &&
          userData.photoUrl !==
            "https://firebasestorage.googleapis.com/v0/b/habitflow-499.firebasestorage.app/o/profile_imgs%2Fflower.jpeg?alt=media&token=e1feb1c0-e1d1-47a1-9120-57f0d1993027"
        ) {
          const oldPhotoRef = storage().refFromURL(userData.photoUrl);
          await oldPhotoRef.delete();
          console.log("Old profile photo deleted successfully.");
        }
      } catch (error) {
        console.error("Error deleting old profile photo:", error);
      }

      const photoRef = storage().ref(
        `profile_imgs/${userData.uid}/${fileName}`
      );

      try {
        const response = await fetch(uri);
        const blob = await response.blob();

        await photoRef.put(blob);
        const downloadURL = await photoRef.getDownloadURL();

        await updateUserPhoto(userData.uid, downloadURL);
        setUserData({ ...userData, photoUrl: downloadURL });
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    } else {
      console.log("No image selected or user data is unavailable.");
    }
  };

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

  useEffect(() => {
    const loadCompletedTasks = async () => {
      try {
        const tasks = await fetchCompletedChallenges();
        setCompletedTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch completed challenges:", error);
      }
    };

    loadCompletedTasks();
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

      <Image
        source={
          userData?.photoUrl
            ? { uri: userData.photoUrl }
            : require("../../assets/images/flower.jpeg")
        }
        style={styles.profileImage}
      />
      <TouchableOpacity style={styles.linkPhotoButton} onPress={pickImage}>
        <Ionicons name="image-outline" size={20} color="black" />
        <Text style={styles.linkPhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.text}>Points: </Text>
        <Text style={styles.styledtext}>{userData?.points}</Text>
      </View>

      <View style={{ height: 10 }} />
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
      <Text style={styles.completeText}>Completed Task</Text>
      {completedTasks.length === 0 ? (
        <Text style={styles.noCompleteText}>No completed tasks</Text>
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const completedDate = item.completedAt?.toDate
              ? item.completedAt.toDate().toLocaleDateString()
              : "Unknown";

            return (
              <View style={styles.challengeRow}>
                <Text style={styles.challengeTitle}>{item.title}</Text>
                <Text style={styles.challengeDate}>{completedDate}</Text>
                <Text style={styles.challengePoints}>+{item.points}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
    padding: 20,
    paddingBottom: 50,
  },
  username: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "500",
    marginTop: -10,
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
    marginBottom: 15,
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
  linkPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  linkPhotoText: { fontSize: 16, marginLeft: 5 },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  completeText: {
    fontSize: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  noCompleteText: {
    color: "#777",
    fontSize: 15,
  },
  challengeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  challengeTitle: {
    flex: 2,
    fontSize: 16,
  },
  challengeDate: {
    flex: 1.5,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginLeft: 65,
  },
  challengePoints: {
    flex: 1,
    fontSize: 16,
    color: "#A3BF80",
    textAlign: "right",
  },
});
