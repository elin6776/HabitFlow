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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { Alert } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Used for navigation

  // Email sign in Function source reference: https://rnfirebase.io/auth/usage
  const emailSignIn = async () => {
    try {
      const auth = getAuth(getApp()); // Get the auth instance from the app
      await signInWithEmailAndPassword(auth, email, password); // Sign-in method from firebase
      Alert.alert("Success", "Sign in successfully", [
        { text: "OK", onPress: () => router.push("/home") },
      ]);
      router.push("/home"); // Navigate to the home page if sign in success
    } catch (error) {
      // Error handling
      if (error.code === "auth/invalid-email") {
        alert(
          "The email you entered is invalid. Please check and enter a valid email address."
        );
      } else if (error.code === "auth/wrong-password") {
        alert("The password you entered is incorrect. Please try again.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Make sure you enter the correct email and password");
      } else if (error.code === "auth/user-not-found") {
        alert(
          "Unable to find user please check the information you entered or register an account for your email."
        );
      } else {
        alert("Unable to log in: " + error.message);
      }
    }
  };

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
        <View style={loginStyles.container}>
          {/* App logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={loginStyles.logo}
          />

          {/* Login text */}
          <Text style={loginStyles.header}>Login to HabitFlow</Text>

          {/* Email Text Field */}
          <Text style={loginStyles.label}>Email</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
          />

          {/* Password Text Field */}
          <Text style={loginStyles.label}>Password</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCompleteType="password"
            textContentType="password"
          />

          {/* Login Button */}
          <TouchableOpacity
            onPress={emailSignIn}
            style={loginStyles.loginButton}
          >
            <Text style={loginStyles.loginText}>Log in</Text>
          </TouchableOpacity>

          {/* Navigate to Sign-up */}
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={loginStyles.signupText}>
              Don't have an account? Register
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <View style={loginStyles.orContainer}>
            <View style={loginStyles.line} />
            <Text style={loginStyles.orText}>Forgot Passoword?</Text>
            <View style={loginStyles.line} />
          </View>

          {/* Password reset Button */}
          <TouchableOpacity
            onPress={() => router.push("/resetpass")}
            style={loginStyles.resetButton}
          >
            <Text style={loginStyles.resetText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const loginStyles = StyleSheet.create({
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
  loginButton: {
    width: 350,
    height: 50,
    backgroundColor: "#D0E6C1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  signupText: {
    color: "#3468C0",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 10,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    backgroundColor: "#F2F9E9",
  },
  resetIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});