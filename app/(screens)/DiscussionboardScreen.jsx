import { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image,TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from '@react-native-firebase/auth';
import { Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { fetchGeneralDiscussions, fetchChallengeDiscussions, fetchRegularCommentsWithReplies, fetchChallengeCommentsWithReplies,addCommentToChallengePost,addCommentToGeneralPost,addReplyToGeneralPost,addReplyToChallengePost,toggleLike, deleteGeneralDiscussion, deleteChallengeDiscussion,deleteGeneralComment, deleteGeneralReply, deleteChallengeComment, deleteChallengeReply } from "../../src/firebase/firebaseCrud";

export default function DiscussionboardScreen() {
  const [selectedTab, setSelectedTab] = useState("Challenges");
  const [selectedChallengeTab, setSelectedChallengeTab] = useState("Accepted");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState(null);//reply object
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null); // Store uploaded images
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const router = useRouter();

  const loadDiscussions = async () => {
    setLoading(true);
    if (selectedTab === "Challenges") {
      const data = await fetchChallengeDiscussions();// You could filter "Accepted" vs "Other" here if needed
      setDiscussions(data);
    } else {
      const data = await fetchGeneralDiscussions();
      setDiscussions(data);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    //console.log(currentUser);

    if (currentUser) {
      setUser(currentUser);

      // Fetch the username from Firestore using the current user's UID
      firestore()
        .collection('users')
        .doc(currentUser.uid) // Get user document by UID
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setUsername(userData.username); // Set username from Firestore
          }
        })
        .catch(error => {
          console.error("Error fetching user data from Firestore: ", error);
        });
    }
  }, []);

  useEffect(() => {
    loadDiscussions();
  }, [selectedTab, selectedChallengeTab]);
  //expand comments
  const handleExpandComments = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      const comments = selectedTab === "Challenges"
        ? await fetchChallengeCommentsWithReplies(postId)
        : await fetchRegularCommentsWithReplies(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: comments }));
      setExpandedPostId(postId);
    }
  };
  //Like function
  const handleLike = async (postId) => {
    const isChallenge = selectedTab === "Challenges";
    try {
      const updated = await toggleLike(postId, isChallenge);
  
      setDiscussions((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked_by: updated.liked_by,
                likes: updated.likes,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  //refresh afyer change
  const refreshAfterCommentChange = async (postId,selectedTab ) => {
    const updatedDiscussions = selectedTab === "Challenges"
      ? await fetchChallengeDiscussions()
      : await fetchGeneralDiscussions();
    setDiscussions(updatedDiscussions);
  
    const updatedComments = selectedTab === "Challenges"
      ? await fetchChallengeCommentsWithReplies(postId)
      : await fetchRegularCommentsWithReplies(postId);
    setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
  };
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
      {/* Discussion List */}
      <FlatList
        data={discussions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/*trashcan to remove challenage */}
            {item.userID==getAuth().currentUser?.uid &&(
              <View style={styles.trashcan}>
                <TouchableOpacity onPress={async()=>{
                  try{
                    if(selectedTab=="Challenges"){
                      await deleteChallengeDiscussion(item.id);
                    }
                    else if(selectedTab=="Others"){
                      await deleteGeneralDiscussion(item.id);
                    }
                    loadDiscussions();
                  }catch(error){
                    console.error("Failed to delete post:", error);
                    alert("Failed to delete post.");
                  }
                }
                }>
                <Ionicons name="trash"size={20} color="gray"></Ionicons>
                </TouchableOpacity>
              </View>
              )}

            {/* user information */}
            <View style={styles.userRow}>
              <Image
                source={{ uri: item.photoURL || "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__" }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{item.username || "Anonymous"}</Text>
            </View>
            <Text style={styles.titleText}>{item.title || "NONE Title"}</Text>
            {/* Post content */}
            <Text style={styles.description}>{item.description}</Text>
      
            {/* Interactive bar */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionItem} onPress={() => handleLike(item.id)}>
                <Ionicons
                  name={item.liked_by?.includes(getAuth().currentUser?.uid) ? "thumbs-up" : "thumbs-up-outline"}
                  size={18}
                  color={item.liked_by?.includes(getAuth().currentUser?.uid) ? "#4CAF50" : "#000"}
                />
                <Text style={styles.actionText}>{item.likes || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionItem} onPress={() =>{
                setReplyTarget(null);//reset reply target be null
                handleExpandComments(item.id) }}>
                <Ionicons name="chatbubble-outline" size={18} color="#000" />
                <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
              </TouchableOpacity>
              <Ionicons name="heart" size={18} color="red" />
            </View>
              {/* expand comments area */}
            {expandedPostId === item.id && commentsMap[item.id] && (
              <View style={{ marginTop: 10 }}>
                <View style={ [commentsMap[item.id].length > 0 && styles.comments_area]}>
                  {commentsMap[item.id].map((comment) => (
                    <View key={comment.id} style={{ marginBottom: 8 }}>
                      
                      <TouchableOpacity 
                      onPress={() =>setReplyTarget({postId: item.id, commentId: comment.id, username: comment.username,})}
                      onLongPress={() => {
                        if (comment.uid === getAuth().currentUser?.uid) {
                          Alert.alert(
                            "Delete Comment",
                            "Are you sure you want to delete this comment?",
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                onPress: async () => {
                                  const success = selectedTab === "Challenges"
                                    ? await deleteChallengeComment(item.id, comment.id)
                                    : await deleteGeneralComment(item.id, comment.id);
                                  //console.log("delete success:", success);
                                  if (success) {
                                    await refreshAfterCommentChange(item.id,selectedTab);
                                  }
                                },
                                style: "destructive",
                              },
                            ]
                          );
                        }
                      }}
                      >
                        <Text style={{ fontSize: 16, color: "#333", marginLeft:10}}>
                          {comment.username}: {comment.text}
                        </Text>
                      </TouchableOpacity>

                      {comment.replies.map((reply) => (
                        <View key={reply.id} style={{ marginTop: 2}}>
                          <TouchableOpacity
                            //onPress={() =>setReplyTarget({postId: item.id,commentId: comment.id,username: reply.username,})}
                            onLongPress={() => {
                              if (reply.uid === getAuth().currentUser?.uid) {
                                Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Delete",
                                    onPress: async () => {
                                      const success =selectedTab === "Challenges"
                                          ? await deleteChallengeReply(item.id, comment.id, reply.id)
                                          : await deleteGeneralReply(item.id, comment.id, reply.id);
                                      if (success) {
                                        await refreshAfterCommentChange(item.id, selectedTab);
                                      }
                                    },
                                    style: "destructive",
                                  },
                                ]);
                              }
                            }}
                          >
                            <Text style={styles.reply_sty}>
                              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#555" /> Reply by {reply.username}: {reply.text}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
                {/*add comment and replies */}
                {replyTarget?.postId === item.id ? (
                  // Reply  mode
                  <View style={styles.CommentInput}>
                    <TextInput
                      value={newCommentText}
                      onChangeText={setNewCommentText}
                      placeholder={`Reply to ${replyTarget.username}`}
                      style={styles.inputStyle}
                    />
                    <TouchableOpacity
                      onPress={async () => {
                        if (!newCommentText.trim()) return;
                
                        const success = selectedTab === "Challenges"
                          ? await addReplyToChallengePost(replyTarget.postId, replyTarget.commentId, newCommentText)
                          : await addReplyToGeneralPost(replyTarget.postId, replyTarget.commentId, newCommentText);
                
                        if (success) {
                          await refreshAfterCommentChange(item.id,selectedTab );
                          setNewCommentText("");
                          setReplyTarget(null); // clear reply target
                        }
                      }}
                    >
                      <Ionicons name="send" size={20} color="green" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Comment mode
                  <View style={styles.CommentInput}>
                    <TextInput
                      value={newCommentText}
                      onChangeText={setNewCommentText}
                      placeholder="Add a comment..."
                      style={styles.inputStyle}
                    />
                    <TouchableOpacity
                      onPress={async () => {
                        if (!newCommentText.trim()) return;
                
                        const success = selectedTab === "Challenges"
                          ? await addCommentToChallengePost(item.id, newCommentText)
                          : await addCommentToGeneralPost(item.id, newCommentText);
                        //console.log("add success:", success);
                        if (success) {
                          await refreshAfterCommentChange(item.id,selectedTab );
                          setNewCommentText("");
                        }
                      }}
                    >
                      <Ionicons name="send" size={20} color="green" />
                    </TouchableOpacity>
                  </View>
                )}
              <View style={{ height: 1, backgroundColor: "#aaa", marginTop: 15, width: "100%" }} />
            </View>)}
          </View>
        )}
      />
      {/* Floating Add Button */}
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
    marginLeft: 15 ,
    alignItems: "center",
    paddingLeft: 10,
    marginTop: 10,
    height:35,
  },
  description:{
    fontSize: 16,
    padding:5,
  },
  card: {
    //backgroundColor: "#000",
    padding: 0,
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 10,
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  username: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 5,
  },
  
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    paddingTop: 10,
    marginTop: 8,
    paddingBottom:10,
    marginHorizontal: 0,
  },
  
  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#333",
  },
  CommentInput:{ 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 5,
  },
  inputStyle:{
    flex: 1,
    height: 35,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  trashcan:{
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  },
  reply_sty:{
    fontSize: 14,
    color: "#555",
    marginLeft: 15,
    marginTop: 3,
  },
  comments_area:{
    borderWidth: 1,
    borderColor: "#ccc", 
    borderRadius: 8,  
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F8F8F8",
    borderColor: "#C8D4BA",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }

});
