import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { fetchMail } from "../../src/firebase/firebaseCrud";

const messages = [
  { id: '1', subject: 'Welcome!', content: 'Thanks for signing up.' },
  { id: '2', subject: 'Reminder', content: 'Your task is due soon.' },
];

export default function Inbox({ closeModal }) {
  return (
    <View style={styles.modalOverlay}>
      
      <Text style={styles.title}>Inbox</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "#FBFDF4",
    padding: 20,
    margin: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#daf7e2",
    borderRadius: 10,
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: "#6da87d",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  
});
