import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Dimensions} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from "@react-native-picker/picker"
import { fetchDailyTasks, deleteDailyTask, toggleTaskCompletion, addDailyTask, fetchAcceptedChallenges, deleteAcceptedChallenge } from '../../src/firebase/firebaseCrud';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Carousel from 'react-native-snap-carousel';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;  

export default function Homepage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [dailyTasks, setDailyTasks] = useState([]);
  const [challengeTasks, setChallengeTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [selectedDays, setSelectedDays] = useState([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskModal, setSelectedTaskModal] = useState(null);

  useFocusEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDailyTasks = await fetchDailyTasks();
        const fetchedChallengeTasks = await fetchAcceptedChallenges();
        
        setDailyTasks(fetchedDailyTasks);
        setChallengeTasks(fetchedChallengeTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    
    fetchData();
  });

  useEffect(() => {
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
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }
  
  const toggleSelectAll = () => {
    if (selectedDays.length === 7) {
      setSelectedDays([])
    } else {
      setSelectedDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
    }
  }

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minutes = Array.from({ length: 60 }, (_, i) => (i < 10 ? `0${i}` : `${i}`))
  const periods = ["AM", "PM"]

  const addTask = async () => {
    try {
      await addDailyTask({
        title,
        time: `${selectedHour}:${selectedMinute} ${selectedPeriod}`,
        repeat_days: selectedDays,
      });
  
      setModalVisible(false);
      setTitle('');
      setSelectedHour("12");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
      setSelectedDays([]);
  

      const fetchedTasks = await fetchTasks(userId);

      setTasks(fetchedTasks);
  
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  }
  
  const renderChallenges = ({ item, index }) => {
    let borderColor = '';
    switch (item.duration) {
      case 7:
        borderColor = '#D3B29E';
        break;
      case 14:
        borderColor = '#A67C52'; 
        break;
      case 21:
        borderColor = '#8B5D3D'; 
        break;
      case 28:
        borderColor = '#47300e'; 
        break;
      default:
        borderColor = '#241501'; 
        break;
    }

    return (
      <TouchableOpacity>
        <View style={[styles.eachchallenge, { borderColor: borderColor, borderWidth: 2 }]}>
          <Text style={{ fontSize: 18, color: '#33' }}>{item.title || "No Title"}</Text>
          <View style={{ height: 14 }} /> 
          <Text>{item.description || "No Description"}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Daily Tasks */}
      <View style={styles.Wrapper}>
        <Text style={styles.h1}>Daily Tasks</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={35} color={'black'}></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ height: 14 }} /> 

      {/* Daily Tasks */}
      <View>
        {dailyTasks.length > 0 ? (
          dailyTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => toggleTaskCompletion(task.id, task.is_completed, setDailyTasks)}
              onLongPress={() => { setSelectedTaskModal(task.id); }}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.checkbox, task.is_completed && styles.completedText]}>
                  {task.is_completed ? "✓" : "☐"}
                </Text>
                <Text style={[styles.title, task.is_completed && styles.completedText]}>
                  {task.title}
                </Text>
                <Text style={[styles.time, task.is_completed && styles.completedText]}>
                  {task.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <TouchableOpacity style={styles.taskItem}>
            <Text style={styles.h3}>No Tasks, click the + to add a Task!</Text>
          </TouchableOpacity>
        )}

        {selectedTaskModal && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={!!selectedTaskModal}
            onRequestClose={() => setSelectedTaskModal(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalWrapper}>
                <TouchableOpacity onPress={() => setSelectedTaskModal(null)}>
                  <Ionicons name="chevron-back-outline" size={40} color={'black'} />
                </TouchableOpacity>
                <Text style={styles.h1}>Task Details</Text>
              </View>

              {/* Task Details */}
              {dailyTasks.map((task) => {
                if (task.id === selectedTaskModal) {
                  return (
                    <View key={task.id}>
                      <Text style={styles.h1}> {task.title}</Text>
                      <Text style={styles.h2}> Time: {task.time}</Text>
                      <Text style={styles.h2}> Completed:{" "}
                        <Text style={{ color: task.is_completed ? 'green' : '' }}>
                          {task.is_completed ? 'Completed' : 'Not Yet'}
                        </Text>
                      </Text>
                      <View style={{ height: 10 }} />
                      <Text style={styles.h2}>Repeats on: </Text>
                      <View style={{ height: 5 }} />
                      
                      <View style={styles.daysContainer}>
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <View key={day} style={[styles.dayButton, task.repeat_days.includes(day) && styles.dayButtonSelected]}>
                            <Text style={[styles.dayButtonText, task.repeat_days.includes(day) && styles.dayButtonTextSelected]}>
                              {day}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Delete Button */}
                      <View style={{ height: 20 }} />
                      <TouchableOpacity
                        style={[styles.Button, { backgroundColor: '#de493c' }]} 
                        onPress={() => {
                          deleteDailyTask(task.id);  
                          setSelectedTaskModal(null); 
                        }}
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
        )}
      </View>

      {/* Accepted Challenges */}
      <View style={styles.line}></View>
      <Text style={styles.h1}>Accepted Challenges</Text>

      <View style={styles.challengebox}>
        <Carousel
          data={challengeTasks}
          renderItem={renderChallenges}
          sliderWidth={screenWidth * 0.9}   
          itemWidth={screenWidth * 0.75}
          loop={false}
          inactiveSlideOpacity={0.7}       
          inactiveSlideScale={0.81}         
        />
      </View>

      <View style={{ height: 10 }} /> 
      {/* Your Progress */}
      <View style={styles.line}></View>
      <Text style={styles.h1}>Your Progress</Text>

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
              <Ionicons name="chevron-back-outline" size={40} color={'black'} />
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
                onValueChange={(itemValue) => setSelectedHour(itemValue)}
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
                onValueChange={(itemValue) => setSelectedMinute(itemValue)}
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
                onValueChange={(itemValue) => setSelectedPeriod(itemValue)}
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
                style={selectedDays.length === 7 ? styles.unselectAll : styles.selectAll}
                onPress={toggleSelectAll}
              >
                <Text style={styles.selectAllText}>
                  {selectedDays.length === 7 ? "Unselect All" : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>

          <View style={{ height: 10 }} />
          <View style={styles.daysContainer}>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayButton, selectedDays.includes(day) && styles.dayButtonSelected]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[styles.dayButtonText, selectedDays.includes(day) && styles.dayButtonTextSelected]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 20 }} />
        </View>

        {/* Add Task */}    
        <View style={{ height: 50 }} />
          <TouchableOpacity style={[styles.Button, { backgroundColor: 'green' }]} onPress={addTask}>
            <Text style={styles.ButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFDF4',
  },
  line: {
    marginTop: 10,
    height: '0.5',
    width: '95%',
    backgroundColor: 'black',
    alignSelf: 'center'
  },
  h1: {
    fontSize: 20,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'left',
    marginLeft: 10
  },
  h2: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'left',
    marginLeft: 20
  },
  h3: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'center', 
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '95%'
  },
  taskItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#eaf5df",
    width: '90%',
    marginHorizontal: '5%', 
    marginVertical: 0, 
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height:35
  },
  checkbox: {
    marginRight: 15,
    fontSize: 16
  },
  title: {
    flex: 1, 
    fontSize: 16
  },
  time: {
    marginLeft: 8,
    fontSize: 16
  },
  modalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20
  },
  modalOverlay: {
    position: 'absolute', 
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FBFDF4',
    zIndex: 100, 
  },  
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: '90%',
    fontSize: 16,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  textInput2: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    width: '30%',
    fontSize: 16,
    alignSelf: 'center',
    backgroundColor: 'white'
  },
  timeContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'white',
    height: 40,
  },
  picker: { 
    width: 90, 
    height: 50,
    bottom: 6,
  },
  separator: { 
    fontSize: 24, 
    marginHorizontal: 5 
  },
  Button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 50
  },
  ButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
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
    backgroundColor: "#4CAF50",
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
    backgroundColor: "#FF6347",
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
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  selectAllText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  challengebox: {
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center',
    padding: 12,
    marginVertical: 10,  
  },
  eachchallenge: {
    backgroundColor: '#EAE4E2',
    borderTopRightRadius: 25,
    padding: 20,
    minHeight: 200,               
    justifyContent: 'center',    
    alignItems: 'center',       
    width: '100%',
    borderStyle: 'dashed'
  }
})