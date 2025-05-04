import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default function Inbox({ closeModal, handleAccept, handleDecline, handleDelete, messages, loading }) {
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
            const isDeclined = item.type === "Invitation_declined";
            const title = isCollaboration
              ? "Collaboration Invite"
              : isAnnouncement
              ? item.title || "Announcement"
              : isDeclined
              ? "Invitation Declined"
              : item.title || "No Subject";
            
            const description = isCollaboration
              ? item.title || "No challenge title"
              : item.description || item.message || "No description provided.";            

            return (
              <View style={styles.message}>
                <View style={styles.headerRow}>
                  <Text
                    style={[
                      styles.subject,
                      isCollaboration && styles.collabTitle,
                      isAnnouncement && styles.announcementTitle,
                      item.type === "Invitation_declined" && styles.declinedTitle,
                    ]}
                  >
                    {title}
                  </Text>

                  {!isCollaboration && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Ionicons name="close-outline" size={26} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {isCollaboration && item.fromUsername && (
                  <Text style={styles.username}>
                    From: <Text style={{ fontWeight: 'bold' }}>{item.fromUsername}</Text>
                  </Text>
                )}

                <View style={{ height: 10 }} />
                <Text>{description}</Text>

                <View style={styles.buttonRow}>
                  {isCollaboration && (
                    <>
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
                    </>
                  )}
                </View>
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
    color: "#2C3E50",
  },
  message: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#fff", 
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8B5D3D",
    borderStyle: "dashed",
  },
  collabTitle: {
    color: "#1D53F5", 
  },
  announcementTitle: {
    color: "#D81B60", 
  },
  declinedTitle: {
    color: "#1D53F5",
  },
  subject: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: "#34495E",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptButton: {
    marginTop: 5,
    backgroundColor: "#34AD75", 
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  declineButton: {
    marginTop: 5,
    backgroundColor: "#E74C3C",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#6DA87D", 
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#D12847",
    borderRadius: 20,
  },
  username: {
    fontStyle: 'italic',
    color: '#000', 
    marginBottom: 5,
  },
});
