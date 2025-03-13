import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome'; 

export default function Homepage() {
  const router = useRouter();  // Initialize router
  const [title, setTitle] = useState('');
  const [starttime, setstartTime] = useState('');
  const [endtime, setendTime] = useState('');

  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
{     /* Daily Tasks */}
      <View style={styles.Wrapper}>
        <Text style={styles.h1}>Daily Tasks</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={40} color={'black'}></Ionicons>
        </TouchableOpacity>
      </View>
      <View style={{ height: 10 }} /> 

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

            <View>
              <Text style={styles.h2}>Title</Text>
              <TextInput
                style={styles.textInput} 
                placeholder="Title" 
                value={title} 
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text style={styles.h2}>Time Interval</Text>
              <View style={styles.modalRow}>
                <TextInput
                  style={styles.textInput2} 
                  placeholder="Start Time" 
                  value={starttime} 
                  onChangeText={setstartTime}
                />
                <Text> - </Text>
                <TextInput
                  style={styles.textInput2} 
                  placeholder="End Time" 
                  value={endtime} 
                  onChangeText={setendTime}
                />
              </View>
            </View>

        </View>
      </Modal>

      {/* Accepted Challenges */}
      <View style={styles.line}></View>
      <Text style={styles.h1}>Accepted Challenges</Text>
      <Text style={styles.challengebox}></Text>
      <View style={{ height: 10 }} /> 
      {/* Your Progress */}
      <View style={styles.line}></View>
      <Text style={styles.h1}>Your Progress</Text>
  </View>

  );
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
  challengebox: {
    backgroundColor: "#BADA88",
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center'
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
  }
});