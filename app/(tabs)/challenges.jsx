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
  CheckBox,
} from "react-native";
import { useRouter } from "expo-router";
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

export default function Challengespage() {
  const router = useRouter();
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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortItem, setSortItem] = useState("Null");
  const [sortDirection, setSortDirection] = useState("asc");
  const [Collaborated, setCollaborated] = useState("No");

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
  const handleAcceptChallenge = async (challengeUid) => {
    try {
      await acceptChallenge({ challengeUid });

      setAcceptedChallenges((prev) => new Set([...prev, challengeUid]));
    } catch (error) {
      console.error("Failed to accept challenge:", error);
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
  const challengeFilters = async (duration, frequency) => {
    let selectDuration = null;
    if (duration === "Null" || duration === null) {
      selectDuration = null;
      setFilterModalVisible(false);
    } else {
      // Convert duration to number if its not null
      selectDuration = Number(duration);
    }

    try {
      // Apply the filter function with the selected value
      const filterChallenges = await filterForChallenge(
        selectDuration,
        frequency
      );
      // console.log("Filtered challenges:", filterChallenges);
      setFilteredChallenges(filterChallenges);
    } catch (error) {
      alert("Error filtering challenge:" + error.message);
    }
  };
  // Display different color for duration tag based on their duration level
  const durationColor = (duration) => {
    if (duration == 7) {
      return { backgroundColor: "#F8F2FF" };
    } else if (duration == 14) {
      return { backgroundColor: "#E3D9FF" };
    } else if (duration == 21) {
      return { backgroundColor: "#E3D9FF" };
    } else if (duration == 28) {
      return { backgroundColor: "#D1C3F7" };
    } else {
      return { backgroundColor: "#A294F9" };
    }
  };
  // Display different color for frequency tag based on their duration level
  const frequencyColor = (frequency) => {
    if (frequency == "Weekly") {
      return { backgroundColor: "#E6F0FF" };
    } else if (frequency == "Every other day") {
      return { backgroundColor: "#E1E9FF" };
    } else if (frequency == "Daily") {
      return { backgroundColor: "#B4D2FB" };
    } else {
      return { backgroundColor: "#E6F0FF" };
    }
  };
  const challengeSorts = async (sortItem, sortDirection) => {
    let selectItem = null;
    if (sortDirection !== "Null") {
      selectDirection = sortDirection;
    } else {
      selectDirection = sortDirection;
    }

    try {
      // Apply the sort function with the selected value
      const sortChallenges = await sortForChallenge(selectDirection);
      // console.log("Filtered challenges:", filterChallenges);
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
                  marginBottom: 12,
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
                  marginBottom: 5,
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
                    challengeFilters(durationQuery, frequencyQuery);
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
                      `${item.description}\n\nDuration: ${item.duration} days\n\nFrequency: ${item.frequency}`,
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
                      {item.duration} days
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
          {/* <Text style={styles.h2}>Collaborate Task</Text>
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
          </View> */}
          <View style={{ height: 25 }} />
          <TouchableOpacity style={styles.button} onPress={handleAddChallenge}>
            <Text style={styles.buttonText}>Add Challenge</Text>
          </TouchableOpacity>
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
  },
  frequency: {
    height: 30,
    width: 110,
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
    width: 80,
    borderRadius: 20,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 5,
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
