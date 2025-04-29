import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default function Inbox({ closeModal, handleAccept, handleDecline, messages, loading  }) {
  return (
    <View style={styles.modalOverlay}>
      <Text style={styles.title}>Inbox</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6da87d" />
      ) : messages.length === 0 ? (
        <Text style={{ textAlign: 'center' }}>No messages found.</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isCollaboration = item.type === "Collaborate";
            const isAnnouncement = item.type === "Announcement";
            const title = isCollaboration
              ? "Collaboration Invite"
              : item.title || "No Subject";
            const description = isCollaboration
              ? item.title || "No challenge title"
              : item.description || "No description provided.";

            return (
              <View style={styles.message}>
                <Text
                  style={[
                    styles.subject,
                    isCollaboration && styles.collabTitle,
                    isAnnouncement && styles.announcementTitle,
                  ]}
                >
                  {title}
                </Text>
                <Text>{description}</Text>

                {isCollaboration && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleAccept(item)}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.declineButton}
                      onPress={() => handleDecline(item)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

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
  collabTitle: {
    color: "#0583b5",
  },
  announcementTitle: {
    color: "#d81b60",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  declineButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
