import React, { useState,useEffect} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";

const comment = {
    id: "1",
    user: "Flower",
    userAvatar: "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__", 
    text: "The hunger games 14 day reading challenge",
    likes: 51,
    comments: 30,
  };
  
export default function DiscussionboardScreen() {
  const [selectedTab, setSelectedTab] = useState("Challenges");
  const [selectedChallengeTab, setSelectedChallengeTab] = useState("Accepted");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const router = useRouter();

  // useEffect(() => {
  //   fetchDiscussions();
  // }, [selectedTab]);

  // const fetchDiscussions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`https://yourserver.com/discussions?category=${selectedTab}`);
  //     const data = await response.json();
  //     setDiscussions(data); 
  //   } catch (error) {
  //     console.error("Error fetching discussions:", error);
  //   }
  //   setLoading(false);
  // };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setSelectedTab("Challenges")} style={[styles.tab, selectedTab === "Challenges" && styles.activeTab]}>
          <Text style={styles.tabText}>Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Others")} style={[styles.tab, selectedTab === "Others" && styles.activeTab]}>
          <Text style={styles.tabText}>Others</Text>
        </TouchableOpacity>
      </View>

      {/* Challenge Dropdown - Small Button under Challenge Tab */}
      {selectedTab === "Challenges" && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownButton}>
            <Text style={styles.dropdownText}>{selectedChallengeTab} Challenges</Text>
            <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={16} color="#000" />
          </TouchableOpacity>
          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity onPress={() => { setSelectedChallengeTab("Accepted"); setDropdownVisible(false); }} style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Accepted Challenges</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setSelectedChallengeTab("Other"); setDropdownVisible(false); }} style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>Other Challenges</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
     {/* Comment Display */}
     <View style={styles.commentContainer}>
        {/* user  */}
        <View style={styles.userRow}>
          <Image source={{ uri: comment.userAvatar }} style={styles.avatar} />
          <Text style={styles.username}>{comment.user}</Text>
        </View>
        {/* Comments */}
        <Text style={styles.commentText}>{comment.text}</Text>
        {/* Bottom interactive bar */}
        <View style={styles.actionRow}>
          <View style={styles.actionItem}>
            <Ionicons name="thumbs-up-outline" size={18} color="#000" />
            <Text style={styles.actionText}>{comment.likes}</Text>
          </View>
          <View style={styles.actionItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#000" />
            <Text style={styles.actionText}>{comment.comments}</Text>
          </View>
          <Ionicons name="heart" size={18} color="red" />
        </View>
        {/* Bottom separator line */}
        <View style={styles.separator} />
      </View>
      
      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton}onPress={() => router.replace("/add-board")}> 

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
