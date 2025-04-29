import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from 'expo-router';
import { Picker } from "@react-native-picker/picker";
import { fetchMail, AcceptInvite, DeclineInvite, fetchDailyTasks, deleteDailyTask, toggleTaskCompletion, toggleChallengeCompletion, addDailyTask, fetchAcceptedChallenges, deleteAcceptedChallenge, updateDailyTaskCompletion, updateChallengeTaskCompletion, sendCollaborationInvite} from "../../src/firebase/firebaseCrud";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import Carousel from "react-native-snap-carousel";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Inbox from '../(screens)/inboxModal';
import AddTaskModal from "../(screens)/addTaskModal"; 
import TaskDetailsModal from "../(screens)/selectedTaskModal";

export default function Homepage() {
  const [title, setTitle] = useState("");
  const [dailyTasks, setDailyTasks] = useState([]);
  const [challengeTasks, setChallengeTasks] = useState([]);

  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [selectedDays, setSelectedDays] = useState([]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inboxVisible, setInboxVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskModal, setSelectedTaskModal] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const fetchedDailyTasks = await fetchDailyTasks();
            const fetchedChallengeTasks = await fetchAcceptedChallenges();

            setDailyTasks(fetchedDailyTasks);
            setChallengeTasks(fetchedChallengeTasks);
          } catch (error) {
            console.error("Failed to fetch tasks:", error);
          }
        } else {
          setDailyTasks([]);
          setChallengeTasks([]);
        }
      });

      return () => unsubscribe();
    }, [])
  );

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const fetchedDailyTasks = await fetchDailyTasks();
          const fetchedChallengeTasks = await fetchAcceptedChallenges();

          const today = new Date().toLocaleDateString();

          const updatedDailyTasks = [];

          for (const task of fetchedDailyTasks) {
            const lastUpdated = task.updatedAt?.toDate
              ? task.updatedAt.toDate()
              : new Date(task.updatedAt);
            const lastUpdatedDay = lastUpdated.toLocaleDateString();

            if (!task.repeat_days || task.repeat_days.length === 0) {
              await deleteDailyTask(task.id);
            } else {
              if (today !== lastUpdatedDay && task.is_completed) {
                await updateDailyTaskCompletion(task.id, false);
                task.is_completed = false;
              }
              updatedDailyTasks.push(task);
            }
          }

          const updatedChallengeTasks = fetchedChallengeTasks.map((task) => {
            const lastUpdated = task.updatedAt?.toDate
              ? task.updatedAt.toDate()
              : new Date(task.updatedAt);
            const lastUpdatedDay = lastUpdated.toLocaleDateString();

            if (today !== lastUpdatedDay && task.is_completed) {
              updateChallengeTaskCompletion(task.id, false);
              task.is_completed = false;
            }
            return task;
          });

          setDailyTasks(updatedDailyTasks);
          setChallengeTasks(updatedChallengeTasks);
        } catch (error) {
          console.error("Failed to fetch or update tasks:", error);
        }
      } else {
        setDailyTasks([]);
        setChallengeTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (inboxVisible) {
      const loadMessages = async () => {
        setLoading(true);
        const inboxMessages = await fetchMail();
        setMessages(inboxMessages);
        setLoading(false);
      };
      loadMessages();
    }
  }, [inboxVisible]);

  const handleAddTask = async () => {
    try {
      await addDailyTask({
        title,
        time: `${selectedHour}:${selectedMinute} ${selectedPeriod}`,
        repeat_days: selectedDays,
      });

      setModalVisible(false);
      setTitle("");
      setSelectedHour("12");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
      setSelectedDays([]);

      const fetchedDailyTasks = await fetchDailyTasks();
      setDailyTasks(fetchedDailyTasks);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDailyTask(taskId);

      const fetchedDailyTasks = await fetchDailyTasks();
      setDailyTasks(fetchedDailyTasks);

      setSelectedTaskModal(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleDeleteChallenge = async (challengeUid) => {
    try {
      await deleteAcceptedChallenge(challengeUid);
      const fetchedChallengeTasks = await fetchAcceptedChallenges();
      setChallengeTasks(fetchedChallengeTasks);
    } catch (error) {
      console.error("Failed to delete challenge:", error);
    }
  };

  const handleToggleTaskCompletion = async (taskId, currentStatus) => {
    try {
      await toggleTaskCompletion(taskId, currentStatus, setDailyTasks);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const handleToggleChallengeCompletion = async (item, setChallengeTasks) => {
    try {
      await toggleChallengeCompletion(
        item.id,
        item.is_completed,
        setChallengeTasks
      );
      const fetchedChallengeTasks = await fetchAcceptedChallenges();
      setChallengeTasks(fetchedChallengeTasks);
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDays.length === 7) {
      setSelectedDays([]);
    } else {
      setSelectedDays([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    }
  };

  const ProgressBar = ({ progress, duration }) => {
    const progressWidth = (progress / duration) * 100;

    return (
      <View style={{ marginVertical: 10, alignItems: "center", width: "100%" }}>
        <View
          style={{
            width: "90%",
            height: 20,
            backgroundColor: "#f0ece9",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              backgroundColor: "#4c8f42",
              width: progressWidth > 100 ? "100%" : `${progressWidth}%`,
            }}
          />
        </View>
        <Text style={{ marginTop: 5, fontSize: 14, color: "#333" }}>
          {`${progress} / ${duration}`}
        </Text>
      </View>
    );
  };

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

  const renderChallenges = ({ item }) => {
    return (
      <View>
        <View style={styles.eachchallenge}>
          <TouchableOpacity
            onPress={() => handleDeleteChallenge(item.id || item.challengeId)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <Ionicons name="close-outline" size={35} color={"black"} />
          </TouchableOpacity>

          <Text style={{ fontSize: 18, color: "#33" }}>
            {item.title || "No Title"}
          </Text>
          <View style={{ height: 10 }} />

          <View style={styles.row}>
            <View
              style={[
                styles.tags,
                durationColor(item.duration),
                { marginRight: 10, width: 50, height: 30 },
              ]}
            >
              <Text style={{ fontSize: 16, color: "#03343b" }}>
                {item.duration}
              </Text>
            </View>
            <View
              style={[
                styles.tags,
                frequencyColor(item.frequency),
                { marginRight: 10, width: 80, height: 30 },
              ]}
            >
              <Text style={{ fontSize: 16, color: "#03343b" }}>
                {item.frequency === "Every other day"
                  ? "Other"
                  : item.frequency}
              </Text>
            </View>
          </View>

          <View style={{ height: 10 }} />
          <Text>{item.description || "No Description"}</Text>
          <View style={{ height: 10 }} />
          <ProgressBar progress={item.progress} duration={item.duration} />
        </View>
      </View>
    );
  };

  const taskFrequency = (task) => {
    if (!task.createdAt) {
      console.log("No creation date for this task:", task);
      return false;
    }
    const creationDate = task.createdAt.toDate
      ? task.createdAt.toDate()
      : new Date(task.createdAt);
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const creationDay = creationDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const showToday = today === creationDay || task.repeat_days.includes(today);

    return showToday;
  };

  const challengeFrequency = (task) => {
    if (!task.repeat_days || task.repeat_days.length === 0) return false;

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const showToday = task.repeat_days.includes(today);

    return showToday;
  };

  const handleAccept = async (invite) => {
    try {
      await AcceptInvite(invite);
      const updatedMessages = await fetchMail();
      setMessages(updatedMessages);
      setLoading(false);

      const updatedChallengeTasks = await fetchAcceptedChallenges();
      setChallengeTasks(updatedChallengeTasks); 
    } catch (error) {
      console.error("Error accepting invite:", error);
    }
  };

  const handleDecline = async (invite) => {
    try {
      await DeclineInvite(invite);
      const updatedMessages = await fetchMail();
      setMessages(updatedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error declining invite:", error);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerRight: () => (
            <TouchableOpacity onPress={() => setInboxVisible(true)}>
              <Ionicons name="mail-outline" size={30} color="black" style={{ marginRight: '10%', marginTop: 5 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <ScrollView>
          {/* Daily Tasks */}
          <View style={{ height: 5 }} />
          <View style={styles.Wrapper}>
            <Text style={styles.h1}>Daily Tasks</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons
                name="add-circle-outline"
                size={35}
                color={"black"}
              />
            </TouchableOpacity>
          </View>
  
          {/* Daily Tasks List */}
          <View style={{ height: 14 }} />
          {dailyTasks.length > 0 ? (
            dailyTasks
              .filter((task) => taskFrequency(task))
              .map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskItem}
                  onPress={() =>
                    handleToggleTaskCompletion(
                      task.id,
                      task.is_completed,
                      setChallengeTasks
                    )
                  }
                  onLongPress={() => {
                    setSelectedTaskModal(task.id);
                  }}
                >
                  <View style={styles.textContainer}>
                    <Text
                      style={[
                        styles.checkbox,
                        task.is_completed && styles.completedText,
                      ]}
                    >
                      {task.is_completed ? "✓" : "☐"}
                    </Text>
                    <Text
                      style={[
                        styles.title,
                        task.is_completed && styles.completedText,
                      ]}
                    >
                      {task.title}
                    </Text>
                    <Text
                      style={[
                        styles.time,
                        task.is_completed && styles.completedText,
                      ]}
                    >
                      {task.time}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
          ) : (
            <TouchableOpacity style={[styles.taskItem, { backgroundColor: "#eaf5df" }]}>
              <Text style={styles.h2}>No Tasks, click the + to add a Task!</Text>
            </TouchableOpacity>
          )}

          {/* Accepted Challenges Tasks List */}
          {challengeTasks.length > 0 &&
          challengeTasks.some((item) => challengeFrequency(item)) ? (
            challengeTasks
              .filter((item) => challengeFrequency(item))
              .map((item, index) => (
                <View
                  key={index}
                  style={[styles.taskItem, { backgroundColor: "#e6e0da" }]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleToggleChallengeCompletion(item, setChallengeTasks)
                    }
                  >
                    <View style={styles.textContainer}>
                      <Text
                        style={[
                          styles.checkbox,
                          item.is_completed && styles.completedText,
                        ]}
                      >
                        {item.is_completed ? "✓" : "☐"}
                      </Text>
                      <Text
                        style={[
                          styles.title,
                          item.is_completed && styles.completedText,
                        ]}
                      >
                        {item.task}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
          ) : (
            <TouchableOpacity style={[styles.taskItem, { backgroundColor: "#e6e0da" }]}>
              <Text style={styles.h2}>No accepted Challenges</Text>
            </TouchableOpacity>
          )}

  
          {/* Accepted Challenges Carousel*/}
          <View style={styles.line}></View>
          <Text style={styles.h1}>Accepted Challenges</Text>
  
          <View style={styles.challengebox}>
            <Carousel
              data={challengeTasks}
              renderItem={({ item }) => renderChallenges({ item })}
              sliderWidth={Dimensions.get("window").width * 0.9}
              itemWidth={Dimensions.get("window").width * 0.75}
              loop={false}
              inactiveSlideOpacity={0.7}
              inactiveSlideScale={0.81}
            />
          </View>
  
          <View style={{ height: 10 }} />
          
          {/* Add Task Modal */}
          <AddTaskModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            title={title}
            setTitle={setTitle}
            selectedHour={selectedHour}
            setSelectedHour={setSelectedHour}
            selectedMinute={selectedMinute}
            setSelectedMinute={setSelectedMinute}
            selectedPeriod={selectedPeriod}
            setSelectedPeriod={setSelectedPeriod}
            selectedDays={selectedDays}
            toggleDay={toggleDay}
            toggleSelectAll={toggleSelectAll}
            handleAddTask={handleAddTask}
          />
          {/* Selected Task Modal */}
          <TaskDetailsModal
            selectedTaskModal={selectedTaskModal}
            setSelectedTaskModal={setSelectedTaskModal}
            dailyTasks={dailyTasks}
            handleDeleteTask={handleDeleteTask}
          />
          {/* Inbox Modal */}
          <Modal
            visible={inboxVisible}
            animationType="slide"
            onRequestClose={() => setInboxVisible(false)}
          >
            <Inbox
              closeModal={() => setInboxVisible(false)}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              messages={messages}
              loading={loading}
            />
          </Modal>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBFDF4",
    width: "100%",
    flex: 1,
  },
  line: {
    height: 0.5,
    width: "95%",
    backgroundColor: "black",
    alignSelf: "center",
  },
  h1: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 12,
    textAlign: "left",
    marginLeft: 10,
  },
  h2: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 6,
    textAlign: "center",
  },
  Wrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
  },
  taskItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 0,
    backgroundColor: "#eaf5df",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 35,
  },
  checkbox: {
    marginRight: 15,
    fontSize: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  time: {
    marginLeft: 8,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  challengebox: {
    borderRadius: 15,
    width: "95%",
    alignSelf: "center",
    padding: 12,
    marginVertical: 10,
  },
  eachchallenge: {
    backgroundColor: "white",
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderStyle: "dashed",
    borderColor: "#8B5D3D",
    borderWidth: 2,
  },
  tags: {
    width: 100,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
});
