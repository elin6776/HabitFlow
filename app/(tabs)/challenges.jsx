import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  Modal,
} from "react-native";
import {
  fetchChallenges,
  acceptChallenge,
  fetchAcceptedChallenges,
  addChallenge,
  filterForChallenge,
  sortForChallenge,
} from "../../src/firebase/firebaseCrud";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../src/config/firebaseConfig";
import { sendCollaborationInvite } from "../../src/firebase/firebaseCrud";

export default function Challengespage() {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7");
  const [task, setTask] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [frequencyQuery, setFrequencyQuery] = useState("Null");
  const [durationQuery, setDurationQuery] = useState("Null");
  const [pointQuery, setPointQuery] = useState("Null");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortItem, setSortItem] = useState("Null");
  const [sortDirection, setSortDirection] = useState("asc");
  const [Collaborated, setCollaborated] = useState("No");
  const [showCollaboratePrompt, setShowCollaboratePrompt] = useState(false);
  const [collaboratorUid, setCollaboratorUid] = useState("");
  const [pendingChallengeId, setPendingChallengeId] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    // Load Challenges from firestore
    const loadData = async () => {
      try {
        const fetchedChallenges = await fetchChallenges();
        setChallenges(fetchedChallenges);
        setFilteredChallenges(fetchedChallenges);

        const acceptedIds = await fetchAcceptedChallenges();
        setAcceptedChallenges(new Set(acceptedIds));
      } catch (error) {
        console.error("Error loading challenges:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadInvites = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;

        const invitesSnapshot = await getDocs(
          collection(db, "users", user.uid, "pending_collaborations")
        );

        const invitesList = invitesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPendingInvites(invitesList);
      } catch (error) {
        console.error("Failed to fetch invites:", error);
      }
    };

    loadInvites();
  }, []);

  // Handle search by title
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredChallenges(challenges);
    } else {
      const filtered = challenges.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChallenges(filtered);
    }
  };

  // Accept challenge
  const handleAcceptChallenge = (challengeUid) => {
    Alert.alert(
      "Accept as Collaborative Task?",
      "Do you want to accept this challenge as a collaborative task?",
      [
        {
          text: "Yes",
          onPress: () => {
            setPendingChallengeId(challengeUid);
            setShowCollaboratePrompt(true);
          },
        },
        {
          text: "No",
          onPress: async () => {
            try {
              await acceptChallenge({ challengeUid });
              setAcceptedChallenges((prev) => new Set([...prev, challengeUid]));
            } catch (error) {
              console.error("Failed to accept challenge:", error);
            }
          },
        },
      ]
    );
  };

  //decline
  const handleDeclineInvite = async (invite) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const inviteRef = doc(
        db,
        "users",
        user.uid,
        "pending_collaborations",
        invite.id
      );
      await deleteDoc(inviteRef);

      const notificationRef = collection(
        db,
        "users",
        invite.fromUid,
        "notifications"
      );
      await addDoc(notificationRef, {
        type: "invite_declined",
        message: `${
          invite.toUsername || "The user"
        } declined your invitation for "${invite.title}".`,
        createdAt: new Date(),
        relatedChallengeId: invite.challengeId,
        declinedByUid: user.uid,
        declinedByUsername: invite.toUsername || "Unknown",
      });

      alert("Invite declined.");
    } catch (error) {
      console.error("Failed to decline invite:", error);
      alert("Failed to decline invite.");
    }
  };

  const handleAcceptInvite = async (invite) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await acceptChallenge({
        challengeUid: invite.challengeId,
        collaboratorUid: invite.fromUid,
        isCollaborative: true,
      });

      const inviteRef = doc(
        db,
        "users",
        user.uid,
        "pending_collaborations",
        invite.id
      );
      await deleteDoc(inviteRef);

      setAcceptedChallenges((prev) => new Set([...prev, invite.challengeId]));

      setPendingInvites((prevInvites) =>
        prevInvites.filter((item) => item.id !== invite.id)
      );

      alert("Challenge accepted successfully!");
    } catch (error) {
      console.error("Failed to accept invite:", error);
      alert("Failed to accept invite.");
    }
  };

  // Add new challenge
  const handleAddChallenge = async () => {
    if (!title || !description || !duration || !task || !frequency) {
      alert("Please fill out all fields");
      return;
    }

    await addChallenge({
      title,
      description,
      duration,
      task,
      frequency,
    });

    setTitle("");
    setDescription("");
    setDuration("7");
    setTask("");
    setFrequency("");
    setModalVisible(false);

    try {
      const updatedChallenges = await fetchChallenges();
      setChallenges(updatedChallenges);
      setFilteredChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error reloading challenges:", error);
    }
  };
  // Filter challeneg based on duration/frequency
  const challengeFilters = async (duration, frequency, points) => {
    let selectDuration,
      selectPoints = null;
    if (duration === "Null" || duration === null) {
      selectDuration = null;
      setFilterModalVisible(false);
    } else {
      // Convert duration to number if its not null
      selectDuration = Number(duration);
    }
    if (points === "Null" || points === null) {
      selectPoints = null;
      setFilterModalVisible(false);
    } else {
      // Convert points to number if its not null
      selectPoints = Number(points);
    }

    try {
      // Apply the filter function with the selected value
      const filterChallenges = await filterForChallenge(
        selectDuration,
        frequency,
        selectPoints
      );
      // console.log("Filtered challenges:", filterChallenges);
      setFilteredChallenges(filterChallenges);
    } catch (error) {
      alert("Error filtering challenge:" + error.message);
    }
  };
  // Display different color for duration tag based on their duration level
  const durationColor = (duration) => {
    switch (duration) {
      case 7:
        return { backgroundColor: "#F2E6FF" };
      case 14:
        return { backgroundColor: "#E1C7FF" };
      case 21:
        return { backgroundColor: "#D1A7FF" };
      case 28:
        return { backgroundColor: "#C6A3FF" };
      default:
        return { backgroundColor: "#A294F9" };
    }
  };
  // Display different color for frequency tag based on their duration level
  const frequencyColor = (frequency) => {
    switch (frequency) {
      case "Weekly":
        return { backgroundColor: "#E6F0FF" };
      case "Every other day":
        return { backgroundColor: "#E1E9FF" };
      case "Daily":
        return { backgroundColor: "#B4D2FB" };
      default:
        return { backgroundColor: "#E6F0FF" };
    }
  };

  const pointsColor = (points) => {
    switch (points) {
      case 9:
        return { backgroundColor: "#FFF5F5" };
      case 20:
        return { backgroundColor: "#FFEFEF" };
      case 33:
        return { backgroundColor: "#FFEAE3" };
      case 48:
        return { backgroundColor: "#FFDADA" };
      default:
        return { backgroundColor: "#FFD4D4" };
    }
  };

  const challengeSorts = async (sortItem, sortDirection) => {
    try {
      // Apply the sort function with the selected value
      const sortChallenges = await sortForChallenge(sortItem, sortDirection);
      setFilteredChallenges(sortChallenges);
    } catch (error) {
      alert("Error sorting challenge:" + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={{ height: 16 }} />
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {/* Filter Button */}
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Ionicons
            name="filter-circle-outline"
            size={35}
            color={"black"}
            marginLeft={10}
          ></Ionicons>
        </TouchableOpacity>

        {/* Sort Button */}
        <TouchableOpacity onPress={() => setSortModalVisible(true)}>
          <FontAwesome
            name="unsorted"
            size={30}
            color="#232B2B"
            marginLeft={10}
          />
        </TouchableOpacity>
        {/* Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)} // Close on pressing back
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#A3BF80",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#3C2A19",
                  fontWeight: "bold",
                  marginBottom: 5,
                  fontSize: 17,
                }}
              >
                Filter Challenge
              </Text>
              {/* Duration Picker */}
              <Text>Duration</Text>
              <Picker
                selectedValue={durationQuery}
                onValueChange={(itemValue) => {
                  if (itemValue !== "Null") {
                    setDurationQuery(itemValue);
                  } else {
                    setDurationQuery(itemValue);
                  }
                }}
                style={{
                  height: 65,
                  width: 230,
                  marginBottom: -8,
                }}
              >
                <Picker.Item label="None" value="Null" />
                <Picker.Item label="7 days" value="7" />
                <Picker.Item label="14 days" value="14" />
                <Picker.Item label="21 days" value="21" />
                <Picker.Item label="28 days" value="28" />
              </Picker>

              {/* Frequency Picker */}
              <Text>Frequency</Text>
              <Picker
                selectedValue={frequencyQuery}
                onValueChange={(itemValue) => setFrequencyQuery(itemValue)}
                style={{ height: 65, width: 230 }}
              >
                <Picker.Item label="None" value="Null" />
                <Picker.Item label="Daily" value="Daily" />
                <Picker.Item label="Every other day" value="Every other day" />
                <Picker.Item label="Weekly" value="Weekly" />
              </Picker>
              {/* Duration Picker */}
              <Text>Points</Text>
              <Picker
                selectedValue={pointQuery}
                onValueChange={(itemValue) => {
                  if (itemValue !== "Null") {
                    setPointQuery(itemValue);
                  } else {
                    setPointQuery(itemValue);
                  }
                }}
                style={{
                  height: 65,
                  width: 230,
                  marginBottom: 3,
                }}
              >
                <Picker.Item label="None" value="Null" />
                <Picker.Item label="9 Points" value="9" />
                <Picker.Item label="20 Points" value="20" />
                <Picker.Item label="33 Points" value="33" />
                <Picker.Item label="48 Points" value="48" />
              </Picker>

              {/* Close Button */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "200",
                }}
              >
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text
                    style={{
                      textAlign: "left",
                      marginTop: 0,
                      paddingLeft: 30,
                      fontSize: 15,
                      color: "#5C4033",
                      fontWeight: "bold",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    challengeFilters(durationQuery, frequencyQuery, pointQuery);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      marginTop: 0,
                      paddingRight: 8,
                      fontSize: 15,
                      color: "#5C4033",
                      fontWeight: "bold",
                    }}
                  >
                    Filter
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Sort Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={sortModalVisible} // Corrected to use the right state variable
          onRequestClose={() => setSortModalVisible(false)} // Close on pressing back
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#A3BF80",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#3C2A19",
                  fontWeight: "bold",
                  marginBottom: 12,
                  fontSize: 17,
                }}
              >
                Sort Challenges
              </Text>
              {/* Sort By Picker */}
              <Text>Sort By</Text>
              <Picker
                selectedValue={sortItem}
                onValueChange={(itemValue) => {
                  if (itemValue !== "Null") {
                    setSortItem(itemValue);
                  } else {
                    setSortItem(itemValue);
                  }
                }}
                style={{
                  height: 65,
                  width: 230,
                  marginBottom: 5,
                }}
              >
                <Picker.Item label="None" value="Null" />
                <Picker.Item label="Title" value="title" />
                <Picker.Item label="Duration" value="duration" />
                <Picker.Item label="Frequency" value="frequency" />
                <Picker.Item label="Points" value="points" />
              </Picker>

              {/* Sort Order Picker */}
              <Text>Order</Text>
              <Picker
                selectedValue={sortDirection}
                onValueChange={(itemValue) => {
                  if (itemValue !== "Null") {
                    setSortDirection(itemValue);
                  } else {
                    setSortDirection(itemValue);
                  }
                }}
                style={{ height: 65, width: 230 }}
              >
                <Picker.Item label="None" value="Null" />
                <Picker.Item label="Ascending" value="asc" />
                <Picker.Item label="Descending" value="desc" />
              </Picker>

              {/* Close and Apply Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "200",
                }}
              >
                <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                  <Text
                    style={{
                      textAlign: "left",
                      marginTop: 10,
                      paddingLeft: 30,
                      fontSize: 15,
                      color: "#5C4033",
                      fontWeight: "bold",
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    challengeSorts(sortItem, sortDirection); // Sort based on selected item and direction
                    setSortModalVisible(false); // Close the modal after sorting
                  }}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      paddingRight: 8,
                      fontSize: 15,
                      color: "#5C4033",
                      fontWeight: "bold",
                    }}
                  >
                    Sort
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <View style={{ height: 14 }} />

      {pendingInvites && pendingInvites.length > 0 && (
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.h1}>Pending Collaboration Invites</Text>
          {pendingInvites.map((invite) => (
            <View
              key={invite.id}
              style={{
                marginVertical: 10,
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#A3BF80",
              }}
            >
              <Text style={styles.h2}>
                From: {invite.fromUsername || "Unknown"}
              </Text>
              <Text style={styles.h3}>
                Challenge: {invite.title || "No Title"}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button
                  title="Accept"
                  onPress={() => handleAcceptInvite(invite)}
                />
                <View style={{ width: 10 }} />
                <Button
                  title="Decline"
                  onPress={() => handleDeclineInvite(invite)}
                  color="red"
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Display Challenges */}
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => {
          const isAccepted = acceptedChallenges.has(item.id);

          return (
            <TouchableOpacity style={styles.challengeItem}>
              <View>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      `${item.title}`,
                      `${item.description}\n\nDuration: ${item.duration} days\n\nFrequency: ${item.frequency}\n\nPoints: ${item.points}`,
                      [
                        {
                          text: "Accept",
                          onPress: () => handleAcceptChallenge(item.id),
                        },
                        {
                          text: "Cancel",
                        },
                      ],
                      { cancelable: true }
                    )
                  }
                >
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.h3}>{item.description}</Text>
                  <View style={styles.infoContainer}>
                    <Text
                      style={[styles.frequency, frequencyColor(item.frequency)]}
                    >
                      {item.frequency}
                    </Text>
                    <Text
                      style={[styles.duration, durationColor(item.duration)]}
                    >
                      {item.duration} Days
                    </Text>
                    <Text style={[styles.duration, pointsColor(item.points)]}>
                      {item.points} Points
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Accept Button */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    borderRadius: 20,
                    overflow: "hidden",
                  }}
                >
                  <Button
                    title={isAccepted ? "Accepted" : "Accept"}
                    onPress={() => handleAcceptChallenge(item.id)}
                    color={isAccepted ? "#ccc" : "#C5DE9D"}
                    disabled={isAccepted}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.h3}>No challenges available.</Text>
        }
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="chevron-back-outline" size={40} color={"black"} />
            </TouchableOpacity>
            <Text style={styles.h1}>Add New Challenge</Text>
          </View>

          <View>
            <Text style={styles.h2}>Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Challenge title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text style={styles.h2}>Description</Text>
            <TextInput
              multiline={true}
              style={styles.textInputd}
              placeholder="Challenge description"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <Text style={styles.h2}>Duration</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={duration}
              onValueChange={(itemValue) => setDuration(itemValue)}
              style={styles.picker}
            >
              {[7, 14, 21, 28].map((value) => (
                <Picker.Item
                  key={value}
                  label={`${value} days`}
                  value={value}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.h2}>Frequency</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={frequency}
              onValueChange={(itemValue) => setFrequency(itemValue)}
              style={styles.picker}
            >
              {["Daily", "Every other day", "Weekly"].map((label, index) => (
                <Picker.Item key={index} label={label} value={label} />
              ))}
            </Picker>
          </View>

          <View>
            <Text style={styles.h2}>Daily Task</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Daily task"
              value={task}
              onChangeText={setTask}
            />
          </View>
          <Text style={styles.h2}>Collaborate Task</Text>
          <View style={styles.pickersContainer}>
            <Picker
              selectedValue={Collaborated}
              onValueChange={(itemValue) => setCollaborated(itemValue)}
              style={styles.picker}
            >
              {["Yes", "No"].map((label, index) => (
                <Picker.Item key={index} label={label} value={label} />
              ))}
            </Picker>
          </View>
          <View style={{ height: 25 }} />
          <TouchableOpacity style={styles.button} onPress={handleAddChallenge}>
            <Text style={styles.buttonText}>Add Challenge</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCollaboratePrompt}
        onRequestClose={() => setShowCollaboratePrompt(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalWrapper, { flexDirection: "column" }]}>
            <Text style={styles.h2}>Enter Collaborator UID</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter the UID"
              value={collaboratorUid}
              onChangeText={setCollaboratorUid}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                if (!collaboratorUid.trim()) {
                  alert("Please enter a UID.");
                  return;
                }

                try {
                  console.log("pendingChallengeId is", pendingChallengeId);
                  await acceptChallenge({
                    challengeUid: pendingChallengeId,
                    collaboratorUid: collaboratorUid.trim(),
                    isCollaborative: true,
                  });

                  await sendCollaborationInvite(
                    collaboratorUid.trim(),
                    pendingChallengeId
                  );

                  setAcceptedChallenges(
                    (prev) => new Set([...prev, pendingChallengeId])
                  );
                  setShowCollaboratePrompt(false);
                  setCollaboratorUid("");
                  setPendingChallengeId(null);
                } catch (error) {
                  console.error(
                    "Failed to accept collaborative challenge:",
                    error
                  );
                  alert("Collaborative challenge failed.");
                }
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCollaboratePrompt(false)}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  marginTop: 10,
                  color: "#777",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.addIconContainer}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle-outline" size={45} color={"#333333"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
    padding: 16,
  },
  h1: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 10,
    textAlign: "left",
    marginLeft: 10,
  },
  h2: {
    color: "#41342B",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    paddingLeft: 25,
  },
  title: {
    color: "#41342B",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  h3: {
    fontSize: 16,
    color: "#555",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  frequency: {
    height: 30,
    width: 105,
    borderRadius: 20,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 5,
    marginRight: 15,
  },
  duration: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
    width: 70,
    borderRadius: 20,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 5,
    marginRight: 15,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 10,
    width: "80%",
    fontSize: 16,
    backgroundColor: "white",
  },
  challengeItem: {
    padding: 22,
    borderBottomWidth: 0.2,
  },
  modalWrapper: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FBFDF4",
    zIndex: 100,
  },
  textInput: {
    height: 45,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingLeft: 10,
    width: 330,
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: "white",
  },
  textInputd: {
    height: 100,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 10,
    paddingLeft: 10,
    width: 330,
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: "white",
    textAlignVertical: "center",
  },
  textInput2: {
    height: 40,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: "30%",
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#C5DE9D",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 160,
    marginBottom: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold",
  },
  addIconContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 10,
  },
  pickerContainer: {
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    height: 45,
    width: 210,
    backgroundColor: "white",
    alignSelf: "start",
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: "150%",
    fontSize: 14,
  },
  pickersContainer: {
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    height: 45,
    width: 210,
    backgroundColor: "white",
    alignSelf: "start",
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
