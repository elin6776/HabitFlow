import React, { useEffect, useState, useCallback } from "react";
import { View,Text,StyleSheet,Image,TouchableOpacity,FlatList } from "react-native";
import { fetchUser,updateUserPhoto,fetchCompletedChallenges } from "../../src/firebase/firebaseCrud";
import { Ionicons } from "@expo/vector-icons";
import { launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import { useFocusEffect } from "@react-navigation/native";

export default function Profile() {
  const [userData, setUserData] = useState(null);
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

  useFocusEffect(
    useCallback(() => {
      const loadCompletedTasks = async () => {
        try {
          const tasks = await fetchCompletedChallenges();
          setCompletedTasks(tasks);
        } catch (error) {
          console.error("Failed to fetch completed challenges:", error);
        }
      };
  
      loadCompletedTasks();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={{ height: 30 }} />
      <Text style={styles.username}>{userData?.username}</Text>
      <View style={{ height: 20 }} />

      <View style={styles.profileImageButton}> 
        <TouchableOpacity onPress={pickImage} style={styles.profileImageButton}>
          <Image
            source={
              userData?.photoUrl
                ? { uri: userData.photoUrl }
                : require("../../assets/images/flower.jpeg")
            }
            style={styles.profileImage}
          />
          <Ionicons
            name="image-outline" size={24} color="black" style={styles.profileIcon}
          />
      </TouchableOpacity>
    </View>

      <View style={{ height: 20 }} />
      <Text style={styles.completeText}>Completed Challenges</Text>
      <View style={{ height: 12 }} />

      {completedTasks.length === 0 ? (
        <Text style={styles.noTasksText}>Haven't completed any challenges yet</Text>
      ) : (
        <FlatList
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.challengeRow}>
              <Text style={styles.challengeTitle}>{item.title}</Text>
              <Text style={styles.challengePoints}>+{item.points}</Text>
            </View>
          )}
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
  },
  profileImageButton: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: "center",
    borderWidth: 0.5
  },
  profileIcon: {
    position: "absolute",
    bottom: 10,
    right: 2,
    backgroundColor: "white", 
    borderRadius: 12, 
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
  iconButton: {
    marginLeft: 10,
    alignSelf: "center",
  },
  completeText: {
    fontSize: 20,
    marginTop: 15,
  },
  challengeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  challengeTitle: {
    fontSize: 16,
    flex: 1,
  },
  challengePoints: {
    fontSize: 16,
    color: "#A3BF80",
    marginLeft: 10,
  },
  noTasksText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 10,
  },
  
});
