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
import { useRouter } from "expo-router";
import {
  fetchChallenges,
  acceptChallenge,
  fetchAcceptedChallenges,
  addChallenge,
} from "../../src/firebase/firebaseCrud";
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

  useEffect(() => {
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
    } catch (error) {
      console.error("Failed to accept challenge:", error);
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={{ height: 16 }} />
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name="filter"
            size={35}
            color={"black"}
            marginLeft={15}
          ></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ height: 14 }} />

      {/* Display Challenges */}
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id}
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
                    <Text style={styles.frequency}>{item.frequency}</Text>
                    <Text style={styles.duration}>{item.duration} days</Text>
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
            <Text style={styles.h1}>Add Challenge</Text>
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

          <View style={{ height: 14 }} />
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
    marginBottom: 12,
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
    backgroundColor: "#FAD7D7",
    height: 30,
    width: 110,
    borderRadius: 20,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 5,
    marginRight: 15,
  },
  duration: {
    backgroundColor: "#DED7FA",
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
    height: 50,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 20,
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
    marginBottom: 20,
    paddingLeft: 10,
    width: 330,
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: "white",
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
    height: 50,
    width: 330,
    backgroundColor: "white",
    alignSelf: "start",
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    height: "150%",
    fontSize: 14,
  },
});
