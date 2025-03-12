import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter

export default function Leaderboard() {
  const router = useRouter();  // Initialize router

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});