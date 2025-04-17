import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
} from "react-native";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  addDiscussionChallenge,
  addGeneralDiscussion,
} from "../../src/firebase/firebaseCrud";
import { fetchAcceptedChallenges } from "../../src/firebase/firebaseCrud";
import { uploadImageAndGetURL } from "../../src/utils/uploadImage";

export default function AddBoardScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("challenge");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [acceptedChallenges, setAcceptedChallenges] = useState([]);
  const [linkedChallengeId, setLinkedChallengeId] = useState(null);
  const [linkedChallengeTitle, setLinkedChallengeTitle] = useState("");
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [imageURL, setImageURL] = useState(null);


  useEffect(() => {
    const fetchChallenges = async () => {
      const challenges = await fetchAcceptedChallenges();
      setAcceptedChallenges(challenges);
    };
    fetchChallenges();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/discussionboard")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add new board</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={challengeModalVisible}
        onRequestClose={() => setChallengeModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#FBFDF4",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={() => setChallengeModalVisible(false)}
            style={{ position: "absolute", top: 40, right: 30, zIndex: 10 }}
          >
            <Ionicons name="close" size={28} color="#444" />
          </TouchableOpacity>

          {/* Modal content */}
          <View
            style={{
              width: "100%",
              maxWidth: 360,
              backgroundColor: "#D4F5AC63",
              borderRadius: 20,
              padding: 24,
              shadowColor: "#FBFDF4",
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 16,
                color: "#333",
              }}
            >
              Select a Challenge
            </Text>

            {acceptedChallenges.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  padding: 16,
                  backgroundColor: "#ffffff",
                  borderRadius: 30,
                  marginBottom: 20,
                  borderWidth: item.challengeId === linkedChallengeId ? 2 : 0,
                  borderColor: "#A3BF80",
                }}
                onPress={() => {
                  setLinkedChallengeId(item.challengeId);
                  setLinkedChallengeTitle(item.title);
                  setChallengeModalVisible(false);
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#333" }}
                >
                  {item.title}
                </Text>
                <Text style={{ fontSize: 13, color: "#777", marginTop: 4 }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Cancel Button */}
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignSelf: "center",
                paddingVertical: 8,
                paddingHorizontal: 20,
              }}
              onPress={() => setChallengeModalVisible(false)}
            >
              <Text style={{ fontSize: 14, color: "#000000" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Dropdown Selector */}
      <TouchableOpacity
        style={styles.selectorContainer}
        onPress={() => setDropdownVisible(!dropdownVisible)}
      >
        <Text style={styles.selectorText}>
          {selectedBoard === "challenge" ? "Challenge" : "Others"}
        </Text>
        <Ionicons
          name={dropdownVisible ? "chevron-up" : "chevron-down"}
          size={16}
          color="#000"
        />
      </TouchableOpacity>

      {dropdownVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedBoard("challenge");
              setDropdownVisible(false);
            }}
          >
            <Text style={styles.dropdownText}>Challenge</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedBoard("general");
              setDropdownVisible(false);
            }}
          >
            <Text style={styles.dropdownText}>Others</Text>
          </TouchableOpacity>
        </View>
      )}

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

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => setChallengeModalVisible(true)}
      >
        <Text style={styles.linkText}>
          {linkedChallengeId
            ? `Linked to: ${linkedChallengeTitle || "Unknown Challenge"}`
            : "Link Challenge"}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={async () => {
          const url = await uploadImageAndGetURL("discussion_imgs");
          if (url) {
            setImageURL(url);
          }
        }}
      >
        <Ionicons name="image-outline" size={20} color="black" />
        <Text style={styles.linkText}>
          {imageURL ? "Photo linked" : "Link Photo"}
        </Text>
      </TouchableOpacity>

      {/* Author Info */}
      <View style={styles.authorContainer}>
        <Text style={styles.authorText}>Author :</Text>

        <Image
          source={{
            uri: "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
          }}
          style={styles.avatar}
        />

        <Text style={styles.username}>You</Text>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={async () => {
          try {
            if (!title || !description) {
              alert("Fill in both fields");
              return;
            }

            let postId;
            if (selectedBoard === "challenge") {
              if (!linkedChallengeId) {
                alert(
                  "Please link a challenge before posting to Challenge board."
                );
                return;
              }

              postId = await addDiscussionChallenge(title, description,linkedChallengeId, imageURL);
            } else {
              postId = await addGeneralDiscussion(title, description, imageURL);
            }

            //console.log("New post ID:", postId);
            alert("Post created!");

            setTimeout(() => {
              router.replace("/discussionboard");
            }, 300);
          } catch (e) {
            alert("Failed to post: " + e.message);
          }
        }}
      >
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
    marginTop: 15,
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
    width: "50%",
    left: 100,
    marginTop: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectorContainer: {
    borderWidth: 1,
    borderColor: "#A3BF80",
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    width: "30%",
  },

  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#A3BF80",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 5,
    width: "40%",
  },

  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  dropdownText: {
    fontSize: 14,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 10,
  },
});
