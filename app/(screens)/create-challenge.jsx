import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateChallengeScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [duration, setDuration] = useState("07");
  const [dailyTask, setDailyTask] = useState("");
  const [image, setImage] = useState(null); // Store uploaded images

  const [isDifficultyModalVisible, setDifficultyModalVisible] = useState(false);
  const [isDurationModalVisible, setDurationModalVisible] = useState(false);

  const difficulties = ["Easy", "Normal", "Hard"];
  const durations = Array.from({ length: 100 }, (_, i) => (i + 7).toString().padStart(2, "0"));

  return (
    <View style={styles.container}>
      {/* return button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Add new challenge</Text>

      {/* Title */}
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Enter title" />

      {/* Description */}
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        multiline
      />

      {/* Difficulty Picker */}
      <View style={styles.labelContainer}>
      <Text style={styles.label}>Difficulty :</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setDifficultyModalVisible(true)}>
        <Text style={styles.dropdownText}>{difficulty}</Text>
        <Ionicons name="chevron-down" size={20} color="black" />
      </TouchableOpacity>
      </View>

      {/* Difficulty Modal */}
      <Modal visible={isDifficultyModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setDifficultyModalVisible(false)}>
          <View style={styles.modalContent}>
            {difficulties.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                    styles.difficultyOption,difficulty === level&& styles.selectedDifficulty,
                ]}
                onPress={() => {
                  setDifficulty(level);
                  setDifficultyModalVisible(false);
                }}
              >
                <Text style={styles.modalText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Duration Picker */}
      <View style={styles.labelContainer}>
      <Text style={styles.label}>Duration :</Text>
      <TouchableOpacity style={styles.dropdown} onPress={() => setDurationModalVisible(true)}>
        <Text style={styles.dropdownText}>{duration}</Text>
        <Ionicons name="chevron-down" size={20} color="black" />
      </TouchableOpacity>
      <Text style={styles.daysLabel}>Days</Text>
      </View>

      {/* Duration Modal */}
      <Modal visible={isDurationModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setDurationModalVisible(false)}>
            <View style={styles.durationModal}>
                <FlatList
                data={durations}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                <TouchableOpacity
                style={styles.durationOption}
                onPress={() => {
                    setDuration(item);
                    setDurationModalVisible(false);
                }}
                >
                    <Text style={styles.durationText}>{item}</Text>
                </TouchableOpacity>
                )}
            />
            </View>
        </TouchableOpacity>
      </Modal>

      {/* Daily Task */}
      <Text style={[styles.label,styles.taskLabel]}>Daily Task</Text>
      <TextInput style={[styles.input,styles.largeInput]} value={dailyTask} onChangeText={setDailyTask} placeholder="Enter daily task" multiline/>

      {/* Link Photo */}
      <TouchableOpacity style={styles.linkPhotoButton} onPress={() => console.log("Upload photo")}>
        <Ionicons name="image-outline" size={20} color="black" />
        <Text style={styles.linkPhotoText}>Link Photo</Text>
      </TouchableOpacity>

      {/* Display uploaded images */}
      {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}

      {/* Author */}
      <View style={styles.authorContainer}>
      <Text style={styles.authorLabel}>Author :</Text>  
      <Image source={{uri: 'https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__'}}
      style={styles.avatar} />
      <Text style={styles.authorText}>You</Text>
      </View>

      {/* Create Board button */}
      <TouchableOpacity style={styles.createButton} onPress={() => console.log("Challenge created")}>
        <Text style={styles.createButtonText}>Create Board</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFDF4", padding: 20 },
  backButton: { position: "absolute", top: 40, left: 20 },
  header: { fontSize: 18,left:40, marginVertical: 20 ,fontFamily:"Itim",borderBottomColor: '#E9E9E9',},
  label: { fontSize: 16, marginTop: 15, marginBottom: 5 ,fontFamily:"ABeeZee"},
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#A3BF80",
    padding: 10,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  labelContainer: {
  flexDirection: "row", 
  marginTop: 20,
},

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#A3BF80",
    paddingHorizontal: 8,
    marginBottom: 0,
    marginLeft: 10,
    marginTop:10,    
    width:"20%",
    height:35,
  },
  difficultyModal: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: "center",
  },
  
  difficultyOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    width: 100, 
    alignItems: "center",
  },
  
  selectedDifficulty: {
    backgroundColor: "#C5DE9D",
    borderRadius: 30,  
  },
  
  difficultyText: {
    fontSize: 13,
    color: "#000",
  },  
  taskLabel: {
    marginTop: 35,
  },  
  durationWrapper: {
    flexDirection: "row",  
    alignItems: "center", 
    marginheigh1:20,
  },
  
  daysLabel: {
    fontSize: 16,
    marginLeft: 6,  
    marginTop: 15,
    color: "#000",
  },
  
  durationModal: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 30,
    width: 80,  
    maxHeight: 200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    alignItems: "center",
  },
  
  durationOption: {
    paddingVertical: 8,
    alignItems: "center",
  },
  
  durationText: {
    fontSize: 16,
    color: "#000",
  },
  
  dropdownText: { fontSize: 14, color: "#000" },
  largeInput: {
    height: 120, 
    textAlignVertical: "top",
    paddingTop: 10,
  },
  
  linkPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  linkPhotoText: { fontSize: 16, marginLeft: 5 },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  authorLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 5,
  },
  authorText: { fontSize: 18, marginLeft: 10 ,fontFamily:"Itim"},

  createButton: {
    backgroundColor: "#C5DE9D",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
    left:100,
    width:"40%",
    height:45,
  },
  createButtonText: { fontSize: 15, fontWeight: "bold", color: "#382C14" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: " center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    width: 250,
    alignItems: "center",
  },
  modalItem: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  modalText: { fontSize: 18 },
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
});
