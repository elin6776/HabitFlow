import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";

const AddChallengeModal = ({
  visible,
  setVisible,
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  frequency,
  setFrequency,
  task,
  setTask,
  handleAddChallenge,
}) => {
  return (
    <AlertNotificationRoot>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={() => setVisible(false)}>
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

          <View style={{ height: 25 }} />
          <TouchableOpacity style={styles.button} onPress={handleAddChallenge}>
            <Text style={styles.buttonText}>Add Challenge</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </AlertNotificationRoot>
  );
};
const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 10,
    textAlign: "left",
    marginLeft: 20,
  },
  h2: {
    color: "#41342B",
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 10,
    marginLeft: 20,
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
    marginLeft: 20,
    marginBottom: 10,
    paddingLeft: 15,
    width: 330,
    fontSize: 16,
    backgroundColor: "white",
  },
  textInputd: {
    height: 100,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 20,
    marginBottom: 10,
    paddingLeft: 15,
    width: 330,
    fontSize: 16,
    backgroundColor: "white",
    textAlignVertical: "top",
    textAlignVertical: "center",
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
});
export default AddChallengeModal;
