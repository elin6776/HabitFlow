import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { getApp } from "@react-native-firebase/app";
import { Alert } from "react-native";
import { getAuth } from "@react-native-firebase/auth";

export default function Reset() {
  const [email, setEmail] = useState("");
  const router = useRouter(); // Used for navigation

  const restPassword = async () => {
    try {
      const auth = getAuth(getApp());
      await auth.sendPasswordResetEmail(email);
      Alert.alert("Reset", "Password reset link sended to your email", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else {
        alert("Unable to send password rest email: " + error.message);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={resetStyles.container}>
        {/* App logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={resetStyles.logo}
        />

        {/* Header text */}
        <Text style={resetStyles.header}>Reset Password</Text>

        {/* Email Text Field */}
        <Text style={resetStyles.label}>Email</Text>
        <TextInput
          style={resetStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="emailAddress"
        />
        {/* Reset Button */}
        <TouchableOpacity
          onPress={restPassword}
          style={resetStyles.resetButton}
        >
          <Text style={resetStyles.resetText}>Send reset email</Text>
        </TouchableOpacity>
        {/* Forgot Password*/}
        <View style={resetStyles.orContainer}>
          <View style={resetStyles.line} />
          <Text style={resetStyles.orText}>Go Back</Text>
          <View style={resetStyles.line} />
        </View>

        {/* Navigate to login */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
          style={resetStyles.loginButton}
        >
          <Text style={resetStyles.loginText}>Go back to login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const resetStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
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
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#808080",
    marginBottom: 10,
  },
  orText: {
    marginHorizontal: 10,
    color: "#808080",
    fontWeight: "bold",
    marginBottom: 10,
  },
  resetButton: {
    width: 350,
    height: 50,
    backgroundColor: "#D0E6C1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    backgroundColor: "#F2F9E9",
    marginTop: -5,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});