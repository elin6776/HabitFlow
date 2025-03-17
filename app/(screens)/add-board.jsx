import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AddBoardScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add new board</Text>
      </View>
      
      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionBox]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />
      
      {/* Link Challenge & Photo */}
      <TouchableOpacity style={styles.linkButton} onPress={() => console.log("Open Link Challenge modal")}>  
        <Text style={styles.linkText}>Link Challenge</Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.linkButton} onPress={() => console.log("Open Link Photo modal")}>  
        <Ionicons name="image-outline" size={20} color="black" />
        <Text style={styles.linkText}>Link Photo</Text>
      </TouchableOpacity>
      
      {/* Author Info */}
      <View style={styles.authorContainer}>
        <Text style={styles.authorText}>Author :</Text>
        <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.avatar} />
        <Text style={styles.username}>You</Text>
      </View>
      
      {/* Create Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create Board</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#A3BF80",
  },
  descriptionBox: {
    height: 200,
    textAlignVertical: "top",
    marginTop:15,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    marginLeft: 5,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  authorText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  username: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#A3BF80",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    width:"50%",
    left:100,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
