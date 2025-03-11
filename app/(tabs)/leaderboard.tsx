import React from 'react';
import { View, Text, SafeAreaView} from 'react-native';
import { useRouter } from 'expo-router';
import Navigation from './layout'; 
import styles from './styles';

export default function Leaderboard() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Absolute Positioning for Navigation */}
      <View style={styles.navWrapper}>
        <Navigation />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum excepturi tempora doloremque ipsam est exercitationem blanditiis architecto non illo nisi. Esse odit cupiditate voluptatum ipsa! Quis non quisquam nesciunt? Praesentium!
        </Text>
      </View>
    </SafeAreaView>
  );
}
