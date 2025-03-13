import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function Homepage() {
  const router = useRouter(); 
  return (
    <View style={styles.container}>

      {/* Rank 1*/}
      <View style={styles.Wrapper}>
                  <Image
                    source={require('../../assets/images/ribbon.png')}
                    style={styles.ribbon}
                  />
        <Text style={styles.h1}></Text>
      </View>
      <View style={styles.line}></View>

      {/* Rest of the rankings */}
      <View style={styles.Wrapper}>
        <Text style={styles.h1}></Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFDF4',
  },
  ribbon: {
    height: 75,
    width:75
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
  }
});