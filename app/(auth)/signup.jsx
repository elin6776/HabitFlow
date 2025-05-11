import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { signUpUser } from "../../src/firebase/firebaseCrud";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AlertNotificationRoot>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />

            <Text style={styles.header}>Register for HabitFlow</Text>

            {/* Input fields */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <AntDesign
                name="user"
                size={20}
                color="black"
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text style={styles.label}>Username</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter a username"
              onChangeText={setUsername}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="black"
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="black"
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignSelf: "flex-start",
                marginBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color="black"
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text style={styles.label}>Confirm Password</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your password again"
              secureTextEntry={true}
              value={confirm}
              onChangeText={setConfirm}
            />
            {/* Sign up button */}
            <TouchableOpacity
              onPress={() =>
                // Function from firebaseCrud
                signUpUser(email, password, username, confirm, router)
              }
              style={[styles.signUpButton]}
            >
              <Text style={styles.signUpText}>Register</Text>
            </TouchableOpacity>
            {/* Navigate to login is already have account */}
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.loginText}>
                Already have an account? Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#472715",
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    color: "#4D4D4D",
    marginBottom: 5,
  },
  input: {
    width: 350,
    height: 50,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  signUpButton: {
    width: 350,
    height: 50,
    backgroundColor: "#D0E6C1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  loginText: {
    color: "#3468C0",
    textDecorationLine: "underline",
    marginBottom: 15,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#808080",
  },
  orText: {
    marginHorizontal: 10,
    color: "#808080",
    fontWeight: "bold",
    marginBottom: 8,
  },
});
