import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Navigation from './layout'; 
import styles from './styles';

export default function Leaderboard() {
  return (
    <View style={styles.container}> 
      <Text>Welcome to the Leaderboard</Text>
      <Navigation />
    </View>
  );
}
