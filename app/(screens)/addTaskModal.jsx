import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function AddTaskModal({
  modalVisible,
  setModalVisible,
  title,
  setTitle,
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
  selectedPeriod,
  setSelectedPeriod,
  selectedDays,
  toggleDay,
  toggleSelectAll,
  handleAddTask,
}) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i < 10 ? `0${i}` : `${i}`
  );
  const periods = ["AM", "PM"];

  return (
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
          <Text style={styles.h1}>Add Task</Text>
        </View>

        {/* Task Title */}
        <View>
          <Text style={styles.h2}>Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Task Time Interval */}
        <View>
          <Text style={styles.h2}>Time Interval</Text>
          <View style={styles.modalRow}>
            <View style={styles.timeContainer}>
              <Picker
                selectedValue={selectedHour}
                onValueChange={setSelectedHour}
                style={styles.picker}
              >
                {hours.map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
            </View>
            <Text style={styles.separator}>:</Text>

            <View style={styles.timeContainer}>
              <Picker
                selectedValue={selectedMinute}
                onValueChange={setSelectedMinute}
                style={styles.picker}
              >
                {minutes.map((minute) => (
                  <Picker.Item key={minute} label={minute} value={minute} />
                ))}
              </Picker>
            </View>

            <View style={styles.timeContainer}>
              <Picker
                selectedValue={selectedPeriod}
                onValueChange={setSelectedPeriod}
                style={styles.picker}
              >
                {periods.map((period) => (
                  <Picker.Item key={period} label={period} value={period} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Task Frequency */}
        <View>
          <Text style={styles.h2}>Repeats on:</Text>
          <View style={{ height: 5 }} />
          <View style={styles.selectAllContainer}>
            <TouchableOpacity
              style={
                selectedDays.length === 7
                  ? styles.unselectAll
                  : styles.selectAll
              }
              onPress={toggleSelectAll}
            >
              <Text style={styles.selectAllText}>
                {selectedDays.length === 7 ? "Unselect All" : "Select All"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 10 }} />
          <View style={styles.daysContainer}>
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.dayButtonText,
                    selectedDays.includes(day) && styles.dayButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 20 }} />
        </View>

        {/* Add Task */}
        <View style={{ height: 50 }} />
        <TouchableOpacity
          style={[styles.Button, { backgroundColor: "green" }]}
          onPress={handleAddTask}
        >
          <Text style={styles.ButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 12,
    textAlign: "left",
    marginLeft: 10,
  },
  h2: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 12,
    textAlign: "left",
    marginLeft: 20,
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
    height: 40,
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: "90%",
    fontSize: 16,
    alignSelf: "center",
    backgroundColor: "white",
  },
  timeContainer: {
    borderColor: "#A3BF80",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "white",
    height: 40,
  },
  picker: {
    width: 90,
    height: 50,
    bottom: 6,
  },
  separator: {
    fontSize: 24,
    marginHorizontal: 5,
  },
  Button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 50,
  },
  ButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  dayButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    margin: 5,
  },
  dayButtonSelected: {
    backgroundColor: "#5cad5f",
  },
  dayButtonText: {
    color: "black",
    fontSize: 16,
  },
  dayButtonTextSelected: {
    color: "white",
  },
  selectAllContainer: {
    flexDirection: "row",
    marginLeft: 20,
  },
  selectAllButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  unselectAllButton: {
    backgroundColor: "#e02440",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectAll: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  unselectAll: {
    backgroundColor: "#ed5a5a",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  selectAllText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
