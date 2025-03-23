import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { fetchGeneralDiscussions, fetchDiscussionChallenges, toggleLike } from "../../src/firebase/firebaseCrud";

export default function DiscussionboardScreen() {
  const [selectedTab, setSelectedTab] = useState("Challenges");
  const [selectedChallengeTab, setSelectedChallengeTab] = useState("Accepted");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;

  const loadDiscussions = async () => {
    setLoading(true);
    if (selectedTab === "Challenges") {
      const data = await fetchDiscussionChallenges(); // You could filter "Accepted" vs "Other" here if needed
      setDiscussions(data);
    } else {
      const data = await fetchGeneralDiscussions();
      setDiscussions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDiscussions();
  }, [selectedTab,selectedChallengeTab]);

  const handleLike = async (id) => {
    const isChallenge = selectedTab === "Challenges";
    await toggleLike(id, isChallenge);
    setDiscussions((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              liked_by: post.liked_by?.includes(currentUserId)
                ? post.liked_by.filter((uid) => uid !== currentUserId)
                : [...(post.liked_by || []), currentUserId],
              likes: post.liked_by?.includes(currentUserId)
                ? (post.likes || 1) - 1
                : (post.likes || 0) + 1,
            }
          : post
      )
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* User Info */}
      <View style={styles.userRow}>
        <Image
          source={{ uri: item.created_by_avatarUrl || item.avatarUrl || "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__" }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.created_by_displayName || item.username || "Anonymous"}</Text>
      </View>

      {/* Title & Description */}
      <Text style={styles.titleText}>{item.title || "Untitled"}</Text>
      <Text style={styles.description}>{item.description || ""}</Text>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={() => handleLike(item.id)}>
            <Ionicons
              name={item.liked_by?.includes(currentUserId) ? "thumbs-up" : "thumbs-up-outline"}
              size={18}
              color={item.liked_by?.includes(currentUserId) ? "#4CAF50" : "#000"}
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>{item.likes || 0}</Text>
        </View>
        <View style={styles.actionItem}>
          <Ionicons name="chatbubble-outline" size={18} color="#000" />
          <Text style={styles.actionText}>{item.commentsCount || item.comments_count || 0}</Text>
        </View>
        <Ionicons name="heart" size={18} color="red" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setSelectedTab("Challenges")} style={[styles.tab, selectedTab === "Challenges" && styles.activeTab]}>
          <Text style={styles.tabText}>Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Others")} style={[styles.tab, selectedTab === "Others" && styles.activeTab]}>
          <Text style={styles.tabText}>Others</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown under Challenges tab */}
      {selectedTab === "Challenges" && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownButton}>
            <Text style={styles.dropdownText}>{selectedChallengeTab} Challenges</Text>
            <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#000" />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => { setSelectedChallengeTab("Accepted"); setDropdownVisible(false); }}>
                <Text style={styles.dropdownItemText}>Accepted Challenges</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedChallengeTab("Other"); setDropdownVisible(false); }}>
                <Text style={styles.dropdownItemText}>Other Challenges</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Post List */}
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={discussions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No posts found.</Text>}
        />
      )}

      {/* Add Post Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/add-board")}>
        <Ionicons name="add-circle-outline" size={45} color="black" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
  },
  tabs: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#FBFDF4",
  },
  activeTab: {
    backgroundColor: "#D2D8C8",
  },
  tabText: {
    fontSize: 16,
  },
  dropdownContainer: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
  dropdownButton: {
    borderRadius: 50, 
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A3BF80",
  },
  dropdownText: {
    fontSize: 12,
    fontFamily:"ABeeZee",
    marginRight: 5,
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A3BF80",
    marginTop: 5,
    borderRadius: 10, 
  },
  dropdownItem: {
    padding: 8,
  },
  dropdownItemText: {
    fontSize: 12,
    
  },
  challengeCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20, 
  },
  separator: {
    marginTop: 10,
    borderBottomWidth: 1, 
    borderBottomColor: "#E9E9E9",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    overflow: "hidden",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 10, 
  },
  commentText:{
    alignItems: "center",
    paddingLeft: 10,
    marginTop: 10,
    height:35,
  },
  


});
