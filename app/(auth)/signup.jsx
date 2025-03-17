import React, { useState } from 'react';
import { View, Text, StyleSheet,TextInput, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback, ScrollView, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

export default function signUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirm, setConfirm] = useState('');

  const emailSignUp = async () => {
    if (!email || !password || !username || !confirm) {
      alert("Please fill out all the information.");
      return;
    }
    if (password !== confirm) {
      alert("Password and confirm password did not match. Please check again");
      return;
    }
    try {
      const auth = getAuth(getApp());
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Registered successfully", [
        { text: "OK", onPress: () => router.push("/home") }
      ]);
    } catch (error) {
      alert("Unable to sign up: " + error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={registerStyle.container}>
          <Image source={require('../../assets/images/logo.png')} style={registerStyle.logo} />

          <Text style={registerStyle.header}>Sign up to HabitFlow</Text>

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

          <TouchableOpacity onPress={emailSignUp} style={registerStyle.signUpButton}>
            <Text style={registerStyle.signUpText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={registerStyle.loginText}>Already have an account? Log in</Text>
          </TouchableOpacity>
     {/* OR Option*/}
     <View style={registerStyle.orContainer}>
        <View style={registerStyle.line} />
        <Text style={registerStyle.orText}>OR</Text>
        <View style={registerStyle.line} />
      </View>
          <TouchableOpacity style={registerStyle.googleButton}>
            <Image source={require('../../assets/images/google.png')} style={registerStyle.googleIcon} />
            <Text style={registerStyle.googleText}>Log in with Google</Text>
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
    backgroundColor: '#808080',
  },
  orText: {
    marginHorizontal: 10,
    color: '#808080',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});