import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { fetchChallenges } from '../../src/firebase/firebaseCrud';
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Homepage() {
  const router = useRouter() 
  const [challenges, setChallenges] = useState([]);
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const getChallenges = async () => {
      try {
        const fetchedChallenges = await fetchChallenges();
        setChallenges(fetchedChallenges);
      } catch (error) {
        console.error("Error loading challenges:", error);
      }
    };
    getChallenges();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.Wrapper}>
      </View>
      <View style={{ height: 14 }} /> 

      {/* Display Challenges */}
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.challengeItem}>
            <Text style={styles.h2}>{item.title}</Text>
            <Text style={styles.h3}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.h3}>No challenges available.</Text>
        }
      />
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
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '95%',    
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
  addButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 50
  },
  addButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
  },
})