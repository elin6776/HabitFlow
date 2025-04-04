import React, { useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { signUpUser } from "../../src/firebase/firebaseCrud";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={registerStyle.container}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={registerStyle.logo}
          />

          <Text style={registerStyle.header}>Register for HabitFlow</Text>

          <Text style={registerStyle.label}>Username</Text>
          <TextInput
            style={registerStyle.input}
            placeholder="Enter a username"
            onChangeText={setUsername}
          />

          <Text style={registerStyle.label}>Email</Text>
          <TextInput
            style={registerStyle.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={registerStyle.label}>Password</Text>
          <TextInput
            style={registerStyle.input}
            placeholder="Enter your password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <Text style={registerStyle.label}>Confirm Password</Text>
          <TextInput
            style={registerStyle.input}
            placeholder="Enter your password again"
            secureTextEntry={true}
            value={confirm}
            onChangeText={setConfirm}
          />

          <TouchableOpacity
            onPress={() =>
              signUpUser(email, password, username, confirm, router)
            }
            style={[registerStyle.signUpButton]}
          >
            <Text style={registerStyle.signUpText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={registerStyle.loginText}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const registerStyle = StyleSheet.create({
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
    marginBottom: 10,
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