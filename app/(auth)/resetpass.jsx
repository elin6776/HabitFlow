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
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { getApp } from "@react-native-firebase/app";
import { getAuth } from "@react-native-firebase/auth";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { MaterialIcons } from "@expo/vector-icons";

export default function Reset() {
  const [email, setEmail] = useState("");
  const router = useRouter(); // Used for navigation

  const restPassword = async () => {
    try {
      const auth = getAuth(getApp());
      await auth.sendPasswordResetEmail(email);
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Password reset link sent to your email",
        duration: 1000,
      });
      router.push("/");
    } catch (error) {
      let message = "";

      switch (error.code) {
        case "auth/invalid-email":
          message =
            "The email you entered is invalid. Please check and try again.";
          break;
        default:
          message = "Unable to send password reset email: " + error.message;
      }

      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Failed to send reset email",
        textBody: message,
      });
    }
  };
  return (
    <AlertNotificationRoot>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* App logo */}
          <Image
            source={require("../../assets/images/logo.png")}
            style={styles.logo}
          />

          {/* Header text */}
          <Text style={styles.header}>Reset Password</Text>

          {/* Email Text Field */}
          <Text style={styles.label}>Email</Text>
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
          {/* Reset Button */}
          <TouchableOpacity onPress={restPassword} style={styles.resetButton}>
            <Text style={styles.resetText}>Send reset email</Text>
          </TouchableOpacity>
          {/* Forgot Password*/}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Go Back</Text>
            <View style={styles.line} />
          </View>

          {/* Navigate to login */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginButton}
          >
            <MaterialIcons
              name="arrow-back"
              size={20}
              color="green"
              style={{ marginRight: 15 }}
            />
            <Text style={styles.loginText}>Go back to login</Text>
          </TouchableOpacity>
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
                style={[styles.resetText, { textDecorationLine: "underline" }]}
              >
                Contact Support
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
