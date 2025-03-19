import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Button, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchChallenges, acceptChallenge, fetchAcceptedChallenges, addChallenge } from '../../src/firebase/firebaseCrud';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from "@react-native-picker/picker"

export default function Challengespage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('7');
  const [task, setTask] = useState('');
  const [frequency, setFrequency] = useState('Daily');

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
    if (query.trim() === '') {
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
      console.error('Failed to accept challenge:', error);
    }
  };

  const handleAddChallenge = async () => {
    if (!title || !description || !duration || !task || !frequency) {
      alert('Please fill out all fields');
      return;
    }
  
    await addChallenge({
      title,
      description,
      duration,
      task,
      frequency,
    });

    setTitle('');
    setDescription('');
    setDuration('7');
    setTask('');
    setFrequency('');
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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add-circle-outline" size={35} color={'black'}></Ionicons>
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
            <TouchableOpacity 
              style={styles.challengeItem} 
              onPress={() => console.log(`Clicked: ${item.title}`)}
            >
              <View>
                <Text style={styles.h2}>{item.title}</Text>
                <Text style={styles.h3}>{item.description}</Text>
              </View>
              
              <Button 
                title={isAccepted ? "Accepted" : "Accept"}
                onPress={() => handleAcceptChallenge(item.id)}
                color={isAccepted ? "#ccc" : "#4CAF50"}
                disabled={isAccepted}
              />
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
            <Ionicons name="chevron-back-outline" size={40} color={'black'} />
          </TouchableOpacity>
          <Text style={styles.h1}>Add Challenge</Text>
        </View>

        <View>
          <Text style={styles.h2}>Title</Text>
          <TextInput
            style={styles.textInput} 
            placeholder="Drink Water for a week" 
            value={title} 
            onChangeText={setTitle}
          />
        </View>

        <View>
          <Text style={styles.h2}>Description</Text>
          <TextInput
            style={styles.textInput} 
            placeholder="Every day drink 1 gallon of water for a week" 
            value={description} 
            onChangeText={setDescription}
          />
        </View>

        <View style={{ height: 20 }} /> 
        <Text style={styles.h2}>Duration</Text>
        <Picker
          selectedValue={duration}
          onValueChange={(itemValue) => setDuration(itemValue)}
          style={styles.picker}
        >
          {[7, 14, 21, 28].map((value) => (
            <Picker.Item key={value} label={`${value} days`} value={value} />
          ))}
        </Picker>

        <View style={{ height: 14 }} /> 
        <Text style={styles.h2}>Frequency of Task</Text>
        <Picker
          selectedValue={frequency}
          onValueChange={(itemValue) => setFrequency(itemValue)}
          style={styles.picker}
        >
          {['Daily', 'Every other day', 'Weekly'].map((label, index) => (
            <Picker.Item key={index} label={label} value={label} />
          ))}
        </Picker>

        <View>
          <Text style={styles.h2}>Task</Text>
          <TextInput
            style={styles.textInput} 
            placeholder="Drink a Gallon of Water" 
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFDF4',
    padding: 16
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
    fontWeight: 'bold',
    marginBottom: 4,
  },
  h3: {
    fontSize: 16,
    color: '#555',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#A3BF80',
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 10,
    width: '80%',
    fontSize: 16,
    backgroundColor: 'white'
  },
  challengeItem: {
    padding: 22,
    borderBottomWidth: 0.2,  
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
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
