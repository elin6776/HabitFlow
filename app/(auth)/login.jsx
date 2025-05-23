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
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { getApp } from "@react-native-firebase/app";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Used for navigation

  // Email sign in Function reference: https://rnfirebase.io/auth/usage
  const emailSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Incomplete Information",
        textBody: "Please fill out all the information.",
      });
      return;
    }
    try {
      const auth = getAuth(getApp()); // Get the auth instance from the app
      // Sign-in method from firebase
      await signInWithEmailAndPassword(auth, email, password);
      // Toast notification
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Sign in successfully",
        duration: 1000,
      });
      // Navigate to homepage
      setTimeout(() => {
        router.push("/home");
      }, 500);
    } catch (error) {
      let message = "";
      // Error code
      switch (error.code) {
        case "auth/invalid-email":
          message =
            "The email you entered is invalid. Please check and try again.";
          break;
        case "auth/wrong-password":
          message = "The password you entered is incorrect. Please try again.";
          break;
        case "auth/invalid-credential":
          message = "Make sure you enter the correct email and password.";
          break;
        case "auth/user-not-found":
          message = "Please check the information or register an account.";
          break;
        default:
          message = "Unable to log in: " + error.message;
      }
      // Toast message
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Login Failed",
        textBody: message,
      });
    }
  };

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
            {/* App logo */}
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
            />

            {/* Login text */}
            <Text style={styles.title}>Login to HabitFlow</Text>

            {/* Email Text Field */}
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
                color="#4D4D4D"
                style={{ marginRight: 8, marginBottom: 5 }}
              />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
            />

            {/* Password Text Field */}
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
                color="#4D4D4D"
                style={{ marginRight: 8, marginBottom: 10 }}
              />
              <Text style={styles.label}>Password</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCompleteType="password"
              textContentType="password"
            />

            {/* Login Button */}
            <TouchableOpacity onPress={emailSignIn} style={styles.loginButton}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>

            {/* Navigate to Sign-up */}
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupText}>
                Don't have an account? Register Now
              </Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.problemText}>Having Problem?</Text>
              <View style={styles.line} />
            </View>

            {/* Password reset Button */}
            <TouchableOpacity
              onPress={() => router.push("/resetpass")}
              style={styles.resetButton}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="key"
                  size={20}
                  color="green"
                  style={{ marginRight: 15 }}
                />
                <Text style={styles.resetText}>Reset Password</Text>
              </View>
            </TouchableOpacity>

            {/* Contact Support button */}
            <TouchableOpacity
              onPress={() => Linking.openURL("mailto:habitflow499@gmail.com")}
              style={[{ marginTop: 25 }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="contact-support"
                  size={20}
                  color="green"
                  style={{ marginRight: 15 }}
                />
                <Text
                  style={[
                    styles.resetText,
                    { textDecorationLine: "underline" },
                  ]}
                >
                  Contact Support
                </Text>
              </View>
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
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
  title: {
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
  problemText: {
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
  resetText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
