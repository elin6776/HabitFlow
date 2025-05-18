import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  sendCollaborationInvite,
} from "../../src/firebase/firebaseCrud";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import AddChallengeModal from "../(screens)/addChallengeModal"; // Add challenge modal
import { Stack } from "expo-router";

export default function Challengespage() {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(7);
  const [task, setTask] = useState("");
  const [frequency, setFrequency] = useState("Daily");
  const [frequencyQuery, setFrequencyQuery] = useState("Null");
  const [durationQuery, setDurationQuery] = useState("Null");
  const [pointQuery, setPointQuery] = useState("Null");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortItem, setSortItem] = useState("Null");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showCollaboratePrompt, setShowCollaboratePrompt] = useState(false);
  const [collaboratorUsername, setCollaboratorUsername] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showTypePrompt, setShowTypePrompt] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadChallengesAndAccepted();
    }, [])
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedChallenges = await fetchChallenges();
        setChallenges(fetchedChallenges);

        const acceptedIds = await fetchAcceptedChallenges();
        setAcceptedChallenges(new Set(acceptedIds));

        const unacceptedChallenges = fetchedChallenges.filter(
          (challenge) => !acceptedIds.includes(challenge.id)
        );
        setFilteredChallenges(unacceptedChallenges);
      } catch (error) {
        console.error("Error loading challenges:", error);
      }
    };

    loadData();
  }, []);

  const loadChallengesAndAccepted = async () => {
    try {
      const fetchedChallenges = await fetchChallenges();
      const accepted = await fetchAcceptedChallenges();

      setAcceptedChallenges(accepted);
      setChallenges(fetchedChallenges);
      setFilteredChallenges(fetchedChallenges);
    } catch (error) {
      console.error("Error loading challenges:", error);
    }
  };

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

  const handleAcceptChallenge = async (challengeUid) => {
    try {
      await acceptChallenge({ challengeUid });
      setAcceptedChallenges((prev) => new Set([...prev, challengeUid]));
      loadChallengesAndAccepted();
    } catch (error) {
      console.error("Failed to accept challenge:", error);
    }
  };

  // Add new challenge
  const handleAddChallenge = async () => {
    if (!title || !description || !duration || !task || !frequency) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: "Incomplete",
        textBody: "Please fill out all fields",
        button: "OK",
      });
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
    setDuration(7);
    setTask("");
    setFrequency("Daily");
    setModalVisible(false);

    try {
      const updatedChallenges = await fetchChallenges();
      setChallenges(updatedChallenges);
      setFilteredChallenges(updatedChallenges);
    } catch (error) {
      console.error("Error reloading challenges:", error);
    }
  };

  // Filter challeneg based on duration/frequency/points
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
      // Close modal
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
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Filter challenge failed",
        textBody: "Error filtering challenge:" + error.message,
      });
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
  // Display different color for points
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
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Sort challenge failed",
        textBody: "Error sorting challenge:" + error.message,
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <Stack.Screen
        options={{
          title: "Challenges",
          headerRight: () => (
            <TouchableOpacity
              style={styles.addIconContainer}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={35} color={"#333333"} />
            </TouchableOpacity>
          ),
        }}
      />
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
              name="filter-outline"
              size={30}
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
        </View>
        <View style={{ height: 14 }} />

        {/* Display Challenges */}
        <FlatList
          data={filteredChallenges}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={({ item }) => {
            const isAccepted = Array.from(acceptedChallenges).some(
              (acceptedCh) =>
                acceptedCh.title === item.title &&
                acceptedCh.description === item.description &&
                acceptedCh.duration === item.duration &&
                acceptedCh.task === item.task &&
                acceptedCh.frequency === item.frequency
            );

            return (
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "#8B5D3D",
                  borderRadius: 15,
                  padding: 15,
                  marginVertical: 5,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.h3}>{item.description}</Text>
                <View style={styles.infoContainer}>
                  <Text
                    style={[styles.frequency, frequencyColor(item.frequency)]}
                  >
                    {item.frequency === "Every other day"
                      ? "Other"
                      : item.frequency}
                  </Text>
                  <Text style={[styles.duration, durationColor(item.duration)]}>
                    {item.duration} Days
                  </Text>
                  <Text style={[styles.duration, pointsColor(item.points)]}>
                    {item.points} Points
                  </Text>
                </View>

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
                    onPress={() => {
                      setSelectedItem(item);
                      setShowTypePrompt(true);
                    }}
                    color={isAccepted ? "#ccc" : "#7bc771"}
                    disabled={isAccepted}
                  />
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.h3}>No challenges available.</Text>
          }
        />

        {/* Filter Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={filterModalVisible}
          onRequestClose={() => setFilterModalVisible(false)}
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
                Filter Challenges
              </Text>
              <View style={{ height: 5 }} />

              {/* Duration Picker */}
              <View style={styles.h4}>
                <Text>Duration</Text>
              </View>
              <View style={{ height: 5 }} />
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={durationQuery}
                  onValueChange={(itemValue) => {
                    setDurationQuery(itemValue);
                  }}
                  style={{
                    height: 55,
                    width: "100%",
                  }}
                >
                  <Picker.Item label="None" value="Null" />
                  <Picker.Item label="7 days" value="7" />
                  <Picker.Item label="14 days" value="14" />
                  <Picker.Item label="21 days" value="21" />
                  <Picker.Item label="28 days" value="28" />
                </Picker>
              </View>

              {/* Frequency Picker */}
              <View style={{ height: 10 }} />
              <View style={styles.h4}>
                <Text>Frequency</Text>
              </View>
              <View style={{ height: 5 }} />
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={frequencyQuery}
                  onValueChange={(itemValue) => setFrequencyQuery(itemValue)}
                  style={{ height: 55, width: "100%" }}
                >
                  <Picker.Item label="None" value="Null" />
                  <Picker.Item label="Daily" value="Daily" />
                  <Picker.Item
                    label="Every other day"
                    value="Every other day"
                  />
                  <Picker.Item label="Weekly" value="Weekly" />
                </Picker>
              </View>

              {/* Points Picker */}
              <View style={{ height: 10 }} />
              <View style={styles.h4}>
                <Text>Points</Text>
              </View>
              <View style={{ height: 5 }} />
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={pointQuery}
                  onValueChange={(itemValue) => {
                    setPointQuery(itemValue);
                  }}
                  style={{
                    height: 55,
                    width: "100%",
                  }}
                >
                  <Picker.Item label="None" value="Null" />
                  <Picker.Item label="9 Points" value="9" />
                  <Picker.Item label="20 Points" value="20" />
                  <Picker.Item label="33 Points" value="33" />
                  <Picker.Item label="48 Points" value="48" />
                </Picker>
              </View>

              {/* Close and Filter Buttons */}
              <View style={{ height: 20 }} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "200",
                }}
              >
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                >
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
                    challengeFilters(
                      durationQuery,
                      frequencyQuery,
                      pointQuery
                    );
                    setFilterModalVisible(false);
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
          visible={sortModalVisible}
          onRequestClose={() => setSortModalVisible(false)}
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
              <View style={{ height: 5 }} />
              {/* Sort By Picker */}
              <View style={styles.h4}>
                <Text>Sort By</Text>
              </View>
              <View style={{ height: 5 }} />
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={sortItem}
                  onValueChange={(itemValue) => {
                    setSortItem(itemValue);
                  }}
                  style={{
                    height: 55,
                    width: "100%",
                  }}
                >
                  <Picker.Item label="None" value="Null" />
                  <Picker.Item label="Title" value="title" />
                  <Picker.Item label="Duration" value="duration" />
                  <Picker.Item label="Frequency" value="frequency" />
                  <Picker.Item label="Points" value="points" />
                </Picker>
              </View>
              <View style={{ height: 10 }} />

              {/* Sort Order Picker */}
              <View style={styles.h4}>
                <Text>Order</Text>
              </View>
              <View style={{ height: 5 }} />
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={sortDirection}
                  onValueChange={(itemValue) => {
                    if (itemValue !== "Null") {
                      setSortDirection(itemValue);
                    } else {
                      setSortDirection(itemValue);
                    }
                  }}
                  style={{
                    height: 55,
                    width: "100%",
                  }}
                >
                  <Picker.Item label="None" value="Null" />
                  <Picker.Item label="Ascending" value="asc" />
                  <Picker.Item label="Descending" value="desc" />
                </Picker>
              </View>

              <View style={{ height: 20 }} />
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
                    challengeSorts(sortItem, sortDirection);
                    setSortModalVisible(false);
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

        {/* Add new Challenge Modal */}
        <AddChallengeModal
          visible={modalVisible}
          setVisible={setModalVisible}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          duration={duration}
          setDuration={setDuration}
          frequency={frequency}
          setFrequency={setFrequency}
          task={task}
          setTask={setTask}
          handleAddChallenge={handleAddChallenge}
        />

        {/* Type Challenge Modal */}
        <Modal visible={showTypePrompt} transparent animationType="fade">
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
                width: 300,
                padding: 20,
                backgroundColor: "white",
                borderRadius: 25,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  padding: 10,
                  position: "absolute",
                  top: 5,
                  right: 5,
                }}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTypePrompt(false)}
                >
                  <Ionicons name="close-outline" size={28} color="white" />
                </TouchableOpacity>
              </View>
              <View style={{ height: 22 }} />
              {selectedItem && (
                <>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {`${selectedItem.title}`}
                  </Text>
                  <View style={{ height: 10 }} />
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      color: "#3C2A19",
                      marginBottom: 10,
                    }}
                  >
                    {selectedItem.description}
                  </Text>
                  <View style={{ height: 10 }} />

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: "#3C2A19",
                        marginRight: 8,
                      }}
                    >
                      Duration:
                    </Text>
                    <View
                      style={[
                        {
                          paddingVertical: 4,
                          paddingHorizontal: 10,
                          borderRadius: 15,
                          borderColor: "#ccc",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        durationColor(selectedItem.duration),
                      ]}
                    >
                      <Text style={{ color: "#3C2A19" }}>
                        {selectedItem.duration} days
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: "#3C2A19",
                        marginRight: 8,
                      }}
                    >
                      Frequency:
                    </Text>
                    <View
                      style={[
                        {
                          paddingVertical: 4,
                          paddingHorizontal: 10,
                          borderRadius: 15,
                          borderColor: "#ccc",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        frequencyColor(selectedItem.frequency),
                      ]}
                    >
                      <Text style={{ color: "#3C2A19" }}>
                        {selectedItem.frequency}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 16,
                        color: "#3C2A19",
                        marginRight: 8,
                      }}
                    >
                      Points:
                    </Text>
                    <View
                      style={[
                        {
                          paddingVertical: 4,
                          paddingHorizontal: 10,
                          borderRadius: 15,
                          borderColor: "#ccc",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                        pointsColor(selectedItem.points),
                      ]}
                    >
                      <Text style={{ color: "#3C2A19" }}>
                        {selectedItem.points}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        handleAcceptChallenge(selectedItem.id);
                        setShowTypePrompt(false);
                        Toast.show({
                          type: ALERT_TYPE.SUCCESS,
                          title: "Challenge Accepted",
                          textBody: `You have accepted ${selectedItem.title}`,
                          duration: 10,
                        });
                      }}
                      style={{
                        backgroundColor: "#4CAF50",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>Solo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowCollaboratePrompt(true);
                        setShowTypePrompt(false);
                      }}
                      style={{
                        backgroundColor: "#4CAF50",
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 30,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>
                        Collaborative
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>

        {/* Collaboration Modal */}
        <Modal visible={showCollaboratePrompt} transparent animationType="fade">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 15,
                width: "85%",
              }}
            >
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                Enter Collaborator's Username:
              </Text>
              <TextInput
                value={collaboratorUsername}
                onChangeText={setCollaboratorUsername}
                placeholder="User Username"
                autoCapitalize="none"
                style={{
                  borderColor: "#ccc",
                  borderWidth: 1,
                  borderRadius: 15,
                  padding: 8,
                  marginBottom: 20,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "flex-end",
                }}
              >
                {/* Accept Button */}
                <TouchableOpacity
                  disabled={!collaboratorUsername.trim()}
                  onPress={async () => {
                    try {
                      await sendCollaborationInvite(
                        collaboratorUsername,
                        selectedItem?.id
                      );

                      setAcceptedChallenges(
                        (prev) => new Set([...prev, selectedItem?.id])
                      );
                      setShowCollaboratePrompt(false);
                      setCollaboratorUsername("");

                      Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Invitation Sent",
                        textBody: `You have invited ${collaboratorUsername} to ${selectedItem.title}`,
                        duration: 10,
                      });

                      await loadChallengesAndAccepted();
                    } catch (error) {
                    }
                  }}
                  style={{
                    backgroundColor: collaboratorUsername.trim()
                      ? "#4CAF50"
                      : "#ccc",
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    opacity: collaboratorUsername.trim() ? 1 : 0.6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Invite
                  </Text>
                </TouchableOpacity>

                {/* Decline Button */}
                <TouchableOpacity
                  onPress={() => {
                    setShowCollaboratePrompt(false);
                    setCollaboratorUsername("");
                  }}
                  style={{
                    backgroundColor: "#bababa",
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Decline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </AlertNotificationRoot>
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
  infoContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 0,
  },
  frequency: {
    height: 30,
    width: 80,
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
  addIconContainer: {
    backgroundColor: "transparent=",
    marginRight: "10%",
    marginTop: 5,
  },
  picker: {
    width: "100%",
    height: "150%",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: "#D12847",
    borderRadius: 20,
  },
  pickerStyle: {
    height: 40,
    marginVertical: 5,
    width: 230,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#cbccca",
    borderStyle: "dashed",
  },
});
