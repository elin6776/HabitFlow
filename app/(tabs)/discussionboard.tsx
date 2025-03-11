import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Navigation from './layout'; 
import styles from './styles';

export default function DiscussionBoards() {
  return (
    <View style={styles.container}> 
      <Text>Welcome to the Discussion Boards</Text>
      <Navigation />
    </View>
  );
}
