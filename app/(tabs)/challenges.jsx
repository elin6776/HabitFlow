import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter
import ChallengesScreen from "../(screens)/ChallengesScreen";


export default function Challenges() {
  const router = useRouter();  // Initialize router
  return <ChallengesScreen router={router} />;
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
})
