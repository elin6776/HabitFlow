import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import { getAuth } from "@react-native-firebase/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  collection,
  query,
  where,
  getFirestore,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import {
  ALERT_TYPE,
  Dialog,
  Toast,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { getApp } from "firebase/app";
import {
  fetchGeneralDiscussions,
  fetchChallengeDiscussions,
  fetchRegularCommentsWithReplies,
  fetchChallengeCommentsWithReplies,
  addCommentToChallengePost,
  addCommentToGeneralPost,
  addReplyToGeneralPost,
  addReplyToChallengePost,
  toggleLike,
  deleteGeneralDiscussion,
  deleteChallengeDiscussion,
  deleteGeneralComment,
  deleteGeneralReply,
  deleteChallengeComment,
  deleteChallengeReply,
  fetchAcceptedChallenges,
  acceptChallenge,
} from "../../src/firebase/firebaseCrud";

import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DiscussionboardScreen() {
  const [selectedTab, setSelectedTab] = useState("Challenges");
  const [selectedChallengeTab, setSelectedChallengeTab] = useState("Other");
  const [selectedGeneralTab, setSelectedGeneralTab] = useState("All");
  const [challengedropdownVisible, setChallengeDropdownVisible] =
    useState(false);
  const [generalDropdownVisible, setGeneralDropdownVisible] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState(null); //reply object
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // Store uploaded images
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [acceptedChallengeIds, setAcceptedChallengeIds] = useState([]);
  const [linkedChallengeInfo, setLinkedChallengeInfo] = useState(null);
  const [linkedChallengeModalVisible, setLinkedChallengeModalVisible] =
    useState(false);
  const [isAlreadyAccepted, setIsAlreadyAccepted] = useState(false);
  const [SortdropdownVisible, setSortdropdownVisible] = useState(false);
  const [sortItem, setSortItem] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedCommentPost, setSelectedCommentPost] = useState(null);
  const router = useRouter();
  

  useFocusEffect(
    useCallback(() => {
      loadDiscussions();
    }, [selectedTab, selectedChallengeTab, selectedGeneralTab, sortItem])
  );
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadDiscussions();
    }, 300); // Debounce: delay search execution by 300ms after typing
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const filterAcceptChallenge = async () => {
    //filter for the challenges board
    const accepted = await fetchAcceptedChallenges();
    return accepted.map((item) => item.challengeId);
  };

  const loadDiscussions = async () => {
    // if (loading) return;
    setLoading(true);
    // console.log("selectedChallengeTab:", selectedChallengeTab);
    // console.log("fetching discussions...");

    if (selectedTab === "Challenges") {
      const allPosts = await fetchChallengeDiscussions(sortItem, sortDirection);
      const challenge_ids = await filterAcceptChallenge();
      setAcceptedChallengeIds(challenge_ids);
      //test user accept challenge id
      //console.log("✅ User accepted challenge IDs:", acceptedChallengeIds);

      let filtered;
      if (selectedChallengeTab === "Accepted") {
        filtered = allPosts.filter(
          (post) =>
            post.linkedChallengeId &&
            challenge_ids.includes(post.linkedChallengeId)
        );
      } else if (selectedChallengeTab === "My") {
        filtered = allPosts.filter(
          (post) => post.userID === getAuth().currentUser?.uid
        );
      } else {
        //other will show all post from challenge discussion board
        filtered = allPosts;
        //.filter
        // (
        //   (post) =>
        //     !post.linkedChallengeId ||
        //     !acceptedChallengeIds.includes(post.linkedChallengeId)
        // ); if other is post all challenge discussion post
      }
      {
        /*search box*/
      }
      const normalizedcontent = searchQuery.trim().toLowerCase();

      const searched =
        normalizedcontent === ""
          ? filtered
          : filtered.filter(
              (post) =>
                post.title &&
                post.title.toLowerCase().includes(normalizedcontent)
              //|| post.description.toLowerCase().includes(normalizedQuery)
            );
      setDiscussions(searched);
    } else if (selectedTab === "Others") {
      const allPosts = await fetchGeneralDiscussions(sortItem, sortDirection);

      let filtered = allPosts;
      if (selectedGeneralTab === "My") {
        filtered = allPosts.filter(
          (post) => post.userID === getAuth().currentUser?.uid
        );
      } else {
        filtered = allPosts;
      }
      {
        /*search box*/
      }
      const normalizedcontent = searchQuery.trim().toLowerCase();
      const searched =
        normalizedcontent === ""
          ? filtered
          : filtered.filter(
              (post) =>
                post.title &&
                post.title.toLowerCase().includes(normalizedcontent)
              //|| post.description.toLowerCase().includes(normalizedQuery)
            );
      setDiscussions(searched);
    }

    setLoading(false);
  };
  const loadLinkedChallenge = async (challengeId) => {
    try {
      const db = getFirestore(getApp());
      const docRef = doc(db, "challenges", challengeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLinkedChallengeInfo({ id: docSnap.id, ...docSnap.data() });
        //console.log("Modal being shown for challenge:", challengeId);
        // check this linked challenge is
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const acceptedRef = collection(
            db,
            "users",
            user.uid,
            "accepted_challenges"
          );
          const q = query(acceptedRef, where("challengeId", "==", challengeId));
          const snapshot = await getDocs(q);
          setIsAlreadyAccepted(!snapshot.empty);
        }
        setLinkedChallengeModalVisible(true);
      }
    } catch (error) {
      console.error("Failed to load linked challenge:", error);
    }
  };
  //test linkedChallengeInfo
  // useEffect(() => {
  //   if (linkedChallengeInfo) {
  //     console.log("✅ linkedChallengeInfo updated:", linkedChallengeInfo);
  //   }
  // }, [linkedChallengeInfo]);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        setUser(currentUser);

        try {
          const db = getFirestore(getApp());
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUsername(userData.username);
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore: ", error);
        }
      }
    };

    fetchUserData();
  }, []);

  //expand comments
  const handleExpandComments = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      const comments =
        selectedTab === "Challenges"
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
      await loadDiscussions();
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  //refresh after change
  const refreshAfterCommentChange = async (
    postId,
    selectedTab,
    selectedChallengeTab,
    selectedGeneralTab
  ) => {
    if (selectedTab === "Challenges") {
      const allPosts = await fetchChallengeDiscussions();
      const acceptedChallengeIds = await filterAcceptChallenge();

      const filtered =
        selectedChallengeTab === "Accepted"
          ? allPosts.filter(
              (post) =>
                post.linkedChallengeId &&
                acceptedChallengeIds.includes(post.linkedChallengeId)
            )
          : selectedChallengeTab === "My"
          ? allPosts.filter(
              (post) => post.userID === getAuth().currentUser?.uid
            )
          : allPosts;

      setDiscussions(filtered);
    } else {
      const allPosts = await fetchGeneralDiscussions();

      const filtered =
        selectedGeneralTab === "My"
          ? allPosts.filter(
              (post) => post.userID === getAuth().currentUser?.uid
            )
          : allPosts;

      setDiscussions(filtered);
    }
    const updatedComments =
      selectedTab === "Challenges"
        ? await fetchChallengeCommentsWithReplies(postId)
        : await fetchRegularCommentsWithReplies(postId);

    setCommentsMap((prev) => ({ ...prev, [postId]: updatedComments }));
  };
  return (
    <AlertNotificationRoot>
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setSelectedTab("Challenges")}
          style={[styles.tab, selectedTab === "Challenges" && styles.activeTab]}
        >
          <Text style={styles.tabText}>Challenges</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab("Others")}
          style={[styles.tab, selectedTab === "Others" && styles.activeTab]}
        >
          <Text style={styles.tabText}>General</Text>
        </TouchableOpacity>
      </View>
      {/*search box*/}
      <View style={styles.searchbox}>
        <Ionicons
          name="search"
          size={18}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={{ flex: 1, fontSize: 14, paddingVertical: 3 }}
          placeholder="Search discussions..."
          value={searchQuery}
          onChangeText={(keytext) => setSearchQuery(keytext)}
        />
      </View> 
      {/* filter*/}
      <View style={styles.filter_sortBox}>
        {selectedTab === "Challenges" && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              onPress={() =>
                setChallengeDropdownVisible(!challengedropdownVisible)
              }
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownText}>
                {selectedChallengeTab} Challenges
              </Text>
              <Ionicons
                name={challengedropdownVisible ? "chevron-up" : "chevron-down"}
                size={16}
                color="#000"
              />
            </TouchableOpacity>
            {challengedropdownVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedChallengeTab("Accepted");
                    setChallengeDropdownVisible(false);
                    // loadDiscussions();
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>
                    Accepted Challenges
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedChallengeTab("Other");
                    setChallengeDropdownVisible(false);
                    // loadDiscussions();
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>Other Challenges</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedChallengeTab("My");
                    setChallengeDropdownVisible(false);
                    // loadDiscussions();
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>My Challenge</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {selectedTab === "Others" && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              onPress={() => setGeneralDropdownVisible(!generalDropdownVisible)}
              style={styles.dropdownButton}
            >
              <Text style={styles.dropdownText}>
                {selectedGeneralTab} Posts
              </Text>
              <Ionicons
                name={generalDropdownVisible ? "chevron-up" : "chevron-down"}
                size={16}
                color="#000"
              />
            </TouchableOpacity>

            {generalDropdownVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGeneralTab("All");
                    setGeneralDropdownVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>All Posts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedGeneralTab("My");
                    setGeneralDropdownVisible(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={styles.dropdownItemText}>My Posts</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {/*sort button*/}
        <View style={styles.sortContainer}>
          <TouchableOpacity
            onPress={() => setSortdropdownVisible(!SortdropdownVisible)}
          >
            <FontAwesome
              name="sort-amount-desc"
              size={25}
              color="#232B2B"
              marginLeft={10}
            />
          </TouchableOpacity>
          {SortdropdownVisible && (
            <View style={styles.sortDropdownMenu}>
              <TouchableOpacity
                onPress={() => {
                  setSortItem("createdAt");
                  setSortdropdownVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>🕒 Time</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSortItem("likes");
                  setSortdropdownVisible(false);
                }}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>👍 Likes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {
       /*Dividing lines*/
      }
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#A3BF80",
            borderStyle: "dashed",
            width: "96%",
            marginBottom:5,
          }}
        />
      </View>
      {/* Discussion List */}
      <FlatList
        data={discussions}
        keyExtractor={(item) => item.id}
        //renderItem
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInner}>
              {/*trashcan to remove discussion */}
              {item.userID == getAuth().currentUser?.uid && (
                <View style={styles.trashcan}>
                  <TouchableOpacity
                    onPress={() => {
                      Dialog.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Delete Post",
                        textBody: "Are you sure you want to delete this post?",
                        button: "Delete",
                        onPressButton: async () => {
                          try {
                            if (selectedTab === "Challenges") {
                              await deleteChallengeDiscussion(item.id);
                            } else {
                              await deleteGeneralDiscussion(item.id);
                            }
                            await loadDiscussions();
                            Toast.show({
                              type: ALERT_TYPE.SUCCESS,
                              title: "Deleted",
                              textBody: "Post deleted successfully!",
                              duration: 10, 
                            });
                            Dialog.hide();
                          } catch (error) {
                            console.error("Delete post failed:", error);
                            Toast.show({
                              type: ALERT_TYPE.DANGER,
                              title: "Failed",
                              textBody: "Failed to delete post.",
                            });
                            Dialog.hide();
                          }
                        },
                      });
                    }}
                  >
                    <Ionicons name="trash" size={20} color="gray"></Ionicons>
                  </TouchableOpacity>
                </View>
              )}

              {/* user information */}
              <View style={styles.userRow}>
                <Image
                  source={{
                    uri:
                      item.avatarUrl ||
                      "https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__",
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>
                  {item.username || "Anonymous"}
                </Text>
              </View>
              <Text style={styles.titleText}>{item.title || "NONE Title"}</Text>
              {/* Post content */}
              <View style={styles.Postcontent}>
                <Text style={styles.description}>{item.description}</Text>
                {item.imageURL && (
                  <Image
                    source={{ uri: item.imageURL }}
                    resizeMode="contain"
                    style={styles.Imgstyle}
                  />
                )}
              </View>
              {/*link challenge part if challenge discussion board */}
              {selectedTab === "Challenges" && item.linkedChallengeId && (
                <TouchableOpacity
                  style={styles.viewChallengeBtn}
                  onPress={() => loadLinkedChallenge(item.linkedChallengeId)}
                >
                  <Ionicons name="link-outline" size={16} color="#2E7D32" />
                  <Text style={styles.viewChallengeText}> View Challenge</Text>
                </TouchableOpacity>
              )}

              {/* Interactive bar */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleLike(item.id)}
                >
                  <Ionicons
                    name={
                      item.liked_by?.includes(getAuth().currentUser?.uid)
                        ? "thumbs-up"
                        : "thumbs-up-outline"
                    }
                    size={18}
                    color={
                      item.liked_by?.includes(getAuth().currentUser?.uid)
                        ? "#4CAF50"
                        : "#000"
                    }
                  />
                  <Text style={styles.actionText}>{item.likes || 0}</Text>
                </TouchableOpacity>
                {
                 /*comment button*/
                }
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={async () => {
                    setReplyTarget(null); //reset reply target be null
                    await handleExpandComments(item.id);
                    setSelectedCommentPost(item); 
                    setCommentModalVisible(true); // open modal comment area
                  }}
                >
                  <Ionicons name="chatbubble-outline" size={18} color="#000" />
                  <Text style={styles.actionText}>{item.commentsCount || 0}</Text>
                </TouchableOpacity>
                {
                 /*heart*/
                }
                {selectedTab === "Challenges" && (
                  <Ionicons
                    name="heart"
                    size={18}
                    color={
                      item.linkedChallengeId &&
                      acceptedChallengeIds.includes(item.linkedChallengeId)
                        ? "red"
                        : "#aaa" //unaccept is gray
                    }
                  />
                )}
              </View>
            </View>
          </View>
        )}
      />

      {/* Modal comment area*/}
      {commentModalVisible && selectedCommentPost && (
        <Modal
          visible={commentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCommentModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}
            onPress={() => setCommentModalVisible(false)}
            activeOpacity={1}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              height: "60%",
              width: "100%",
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 15,
              flexDirection: "column",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
                Comments for: {selectedCommentPost?.title}
              </Text>
            </View>
             {/*add comment and replies */}
            {replyTarget?.postId === selectedCommentPost.id?(
              // add Reply  mode
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

                    const success =
                      selectedTab === "Challenges"
                        ? await addReplyToChallengePost(
                            replyTarget.postId,
                            replyTarget.commentId,
                            newCommentText
                          )
                        : await addReplyToGeneralPost(
                            replyTarget.postId,
                            replyTarget.commentId,
                            newCommentText
                          );

                    if (success) {
                      await refreshAfterCommentChange(
                        selectedCommentPost.id,
                        selectedTab,
                        selectedChallengeTab
                      );
                      setNewCommentText("");
                      setReplyTarget(null); // clear reply target
                    }
                  }}
                >
                  <Ionicons name="send" size={20} color="green" marginLeft={5}/>
                </TouchableOpacity>
              </View>
            ) : (
              // add Comment mode
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

                    const success =
                      selectedTab === "Challenges"
                        ? await addCommentToChallengePost(
                            selectedCommentPost.id,
                            newCommentText
                          )
                        : await addCommentToGeneralPost(
                            selectedCommentPost.id,
                            newCommentText
                          );
                    //console.log("add success:", success);
                    if (success) {
                      await refreshAfterCommentChange(
                        selectedCommentPost.id,
                        selectedTab,
                        selectedChallengeTab
                      );
                      setNewCommentText("");
                    }
                  }}
                >
                  <Ionicons name="send" size={20} color="green" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.commentsContainer}>
              <ScrollView
                style={[
                  styles.comments_area,
                ]}
              >
                {/*comment remove and show */}
                {commentsMap[selectedCommentPost.id]?.map((comment) => (
                  <View key={comment.id} style={{ marginBottom: 8 }}>
                    <TouchableOpacity
                      onPress={() =>
                        setReplyTarget({
                          postId: selectedCommentPost.id,
                          commentId: comment.id,
                          username: comment.username,
                        })
                      }
                      onLongPress={() => {
                        if (comment.uid === getAuth().currentUser?.uid) {
                          Dialog.show({
                            type: ALERT_TYPE.WARNING,
                            title: "Delete Comment",
                            textBody: "Are you sure you want to delete this comment?",
                            button: "Delete",
                            onPressButton: async () => {
                              const success =
                                selectedTab === "Challenges"
                                  ? await deleteChallengeComment(
                                      selectedCommentPost.id,
                                      comment.id
                                    )
                                  : await deleteGeneralComment(
                                      selectedCommentPost.id,
                                      comment.id
                                    );
                              //console.log("delete success:", success);
                              if (success) {
                                await refreshAfterCommentChange(
                                  selectedCommentPost.id,
                                  selectedTab,
                                  selectedChallengeTab
                                );
                              }
                              Dialog.hide();
                            },
                          });    
                        }
                      }}
                    >
                      {/*Comment content text*/}
                      <Text
                        style={{
                          fontSize: 16,
                          color: "#333",
                          marginLeft: 10,
                        }}
                      >
                        {comment.username}: {comment.text}
                      </Text>
                    </TouchableOpacity>

                    {/*replies remove and show */}
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={{ marginTop: 2 }}>
                        <TouchableOpacity
                          //onPress={() =>setReplyTarget({postId:selectedCommentPost.id,commentId: comment.id,username: reply.username,})}
                          onLongPress={() => {
                            if (reply.uid === getAuth().currentUser?.uid) {
                              Dialog.show({
                                type: ALERT_TYPE.WARNING,
                                title: "Delete Reply",
                                textBody: "Are you sure you want to delete this reply?",
                                button: "Delete",
                                onPressButton: async () => {
                                  const success =
                                    selectedTab === "Challenges"
                                      ? await deleteChallengeReply(
                                          selectedCommentPost.id,
                                          comment.id,
                                          reply.id
                                        )
                                      : await deleteGeneralReply(
                                          selectedCommentPost.id,
                                          comment.id,
                                          reply.id
                                        );
                                  if (success) {
                                    await refreshAfterCommentChange(
                                      selectedCommentPost.id,
                                      selectedTab,
                                      selectedChallengeTab
                                    );
                                  }
                                  Dialog.hide();
                                },
                              });
                            }
                          }}
                        >
                          <Text style={styles.reply_sty}>
                            <Ionicons
                              name="chatbubble-ellipses-outline"
                              size={16}
                              color="#555"
                            />{" "}
                            Reply by {reply.username}: {reply.text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}      
      {/*modal the challenge infomaction of the post */}
      <Modal
        visible={linkedChallengeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLinkedChallengeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {linkedChallengeInfo ? (
              <>
                <Text style={styles.modalTitle}>
                  {linkedChallengeInfo.title}
                </Text>
                <Text style={styles.modalDescription}>
                  {linkedChallengeInfo.description}
                </Text>

                {/**/}
                {isAlreadyAccepted ? (
                  <TouchableOpacity
                    style={[styles.acceptButton, { backgroundColor: "#ccc" }]}
                    disabled={true}
                  >
                    <Text style={[styles.acceptButtonText, { color: "#666" }]}>
                      Already Accepted
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={async () => {
                      try {
                        await acceptChallenge({
                          challengeUid: linkedChallengeInfo.id,
                        });
                        setLinkedChallengeModalVisible(false);

                        // Update status
                        await loadDiscussions();
                        setIsAlreadyAccepted(true);
                      } catch (error) {
                        console.error("Error accepting challenge:", error);
                      }
                    }}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setLinkedChallengeModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text>Loading...</Text>
            )}
          </View>
        </View>
      </Modal>
      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/add-board")}
      >
        <Ionicons name="add-circle-outline" size={45} color="black" />
      </TouchableOpacity>
    </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
  },
  tabs: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderColor: "#aaa",
    backgroundColor: "#F6F8F3",
    borderWidth: 0.5,
  },
  tab: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#F6F8F3",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    marginHorizontal: 6,
  },
  activeTab: {
    backgroundColor: "#A3BF80",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filter_sortBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#A3BF80',
  },
  dropdownContainer: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 10,
  },
  sortContainer: {
    position: "relative",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
    // borderWidth: 1,
    // borderColor: '#A3BF80',
  },
  sortDropdownMenu: {
    position: "absolute",
    top: 35,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A3BF80",
    borderRadius: 8,
    zIndex: 100,
    paddingVertical: 4,
    width: 120,
  },
  dropdownButton: {
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A3BF80",
    minHeight: 40,
  },
  dropdownText: {
    fontSize: 12,
    marginRight: 5,
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#A3BF80",
    borderRadius: 10,
    zIndex: 100,
    paddingVertical: 4,
    width: 120,
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
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 35,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#C8D4BA",
    backgroundColor: "#fff",
  },
  userRow: {
    margin:5,
    // borderWidth:1,
    // borderColor: "gray",
    // borderRadius:10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    paddingLeft: 10,
  },
  commentText: {
    marginLeft: 15,
    alignItems: "center",
    paddingLeft: 10,
    marginTop: 10,
    height: 35,
  },
  Postcontent:{
    marginHorizontal: 10,
    marginTop: 6,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#A3BF80",
    borderStyle: "dotted",
    borderRadius: 14,
    backgroundColor: "#fff",
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
    marginTop: 3,
    lineHeight: 22,
  },
  card: {
    minHeight:260,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#8B5D3D",
    backgroundColor: "#fff",
  },
  cardInner:{
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    paddingBottom: 3,
  },
  username: {
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#618a38",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 12,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 10,
    marginTop: 8,
    paddingBottom: 10,
    marginHorizontal: 0,
  },

  actionText: {
    marginLeft: 5,
    fontSize: 12,
    color: "#333",
  },
  CommentInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:10,
  },
  inputStyle: {
    flex: 1,
    height: 35,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  trashcan: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  reply_sty: {
    fontSize: 14,
    color: "#555",
    marginLeft: 15,
    marginTop: 3,
  },
  commentsContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#A3BF80",
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
    marginTop: 5,
    marginBottom: 5,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  comments_area: {
    paddingHorizontal: 10,
    marginTop:10,
    marginBottom:10,
  },
  viewChallengeBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#EAF0DB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 6,
    marginLeft: 10,
  },

  viewChallengeText: {
    fontSize: 13,
    color: "#2E7D32",
    fontWeight: "600",
  },
  linkedButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  linkedIcon: {
    marginRight: 4,
  },
  linkedText: {
    color: "#555",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(255, 252, 252)",
  },
  modalContent: {
    backgroundColor: "#FBFDF4",
    padding: 24,
    borderRadius: 16,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#A3BF80",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 10,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  cancelButton: {
    paddingVertical: 10,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 15,
    textAlign: "center",
  },
  Imgstyle: {
    width: "100%", 
    maxHeight:380,
    aspectRatio: 0.95,
    marginTop: 8,
    alignSelf: "center",
    borderRadius: 10,
    // borderWidth:1,
    // borderColor:"black",
  },
  searchbox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#A3BF80",
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
