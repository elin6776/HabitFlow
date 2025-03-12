import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Homepage() {
  const router = useRouter();  // Initialize router

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
{     /* Daily Tasks */}
      <View style={styles.Wrapper}>
        <Text style={styles.h1}>Daily Tasks</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle-outline" size={34} color={'black'}></Ionicons>
        </TouchableOpacity>
      </View>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>This is a popup modal!</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Accepted Challenges */}
        <View style={styles.line}></View>
        <Text style={styles.h1}>Accepted Challenges</Text>
        <Text style={styles.challengebox}></Text>

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
  h1: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'left',
    marginLeft: 10
  },
  line: {
    marginTop: 10,
    height: '0.1%',
    width: '95%',
    backgroundColor: 'black',
    alignSelf: 'center'
  },
  image: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  h2: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 12,
    textAlign: 'left',
    marginLeft: 10
  },
  Wrapper: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center', 
    width: '95%',    
  },
  challengebox: {
    backgroundColor: "#BADA88",
    borderRadius: 15,
    width: '95%',
    alignSelf: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 100,
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 100,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 16,
    color: 'blue',
  },
});
