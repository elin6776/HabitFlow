import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetailsModal({
  selectedTaskModal,
  setSelectedTaskModal,
  dailyTasks,
  handleDeleteTask,
}) {
  return (
    selectedTaskModal && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedTaskModal}
        onRequestClose={() => setSelectedTaskModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <TouchableOpacity onPress={() => setSelectedTaskModal(null)}>
              <Ionicons
                name="chevron-back-outline"
                size={40}
                color={"black"}
              />
            </TouchableOpacity>
            <Text style={styles.h1}>Task Details</Text>
          </View>

          {/* Task Details */}
          {dailyTasks.map((task) => {
            if (task.id === selectedTaskModal) {
              return (
                <View key={task.id}>
                  <Text style={[styles.h1, { fontWeight: "500", fontSize: 24 }]}>
                    {task.title}
                  </Text>

                  <View style={{ height: 10 }} />

                  <View style={styles.modalRow}>
                    <View
                      style={[
                        styles.circle,
                        { backgroundColor: "#94dae3", marginLeft: 10 },
                      ]}
                    >
                      <Text style={{ fontSize: 16, color: "#03343b" }}>
                        {task.time}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.circle,
                        {
                          backgroundColor: task.is_completed
                            ? "#afd991"
                            : "#f5cbcb",
                          marginLeft: 10,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontWeight: "600",
                          fontSize: 16,
                          color: task.is_completed ? "green" : "#de493c",
                        }}
                      >
                        {task.is_completed ? "Completed" : "Not Yet"}
                      </Text>
                    </View>
                  </View>

                  <View style={{ height: 10 }} />
                  <Text style={styles.h2}>Repeats on: </Text>
                  <View style={{ height: 5 }} />

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
                      <View
                        key={day}
                        style={[
                          styles.dayButton,
                          task.repeat_days.includes(day) &&
                            styles.dayButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            task.repeat_days.includes(day) &&
                              styles.dayButtonTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Delete Button */}
                  <View style={{ height: 20 }} />
                  <TouchableOpacity
                    style={[styles.Button, { backgroundColor: "#E74C3C" }]}
                    onPress={() => handleDeleteTask(task.id)}
                  >
                    <Text style={styles.ButtonText}>Delete Daily Task</Text>
                  </TouchableOpacity>
                </View>
              );
            }
            return null;
          })}
        </View>
      </Modal>
    )
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
    backgroundColor: "#34AD75",
  },
  dayButtonText: {
    color: "black",
    fontSize: 16,
  },
  dayButtonTextSelected: {
    color: "white",
  },
  circle: {
    width: 100,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
