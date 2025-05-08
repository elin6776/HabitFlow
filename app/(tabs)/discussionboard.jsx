import { StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import DiscussionboardScreen from "../(screens)/DiscussionboardScreen";

export default function Discussionboard() {
  const router = useRouter(); // Initialize router
  return <DiscussionboardScreen router={router} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
