import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from 'expo-router';
import { signUpUser } from '../../src/firebase/firebaseCrud'; 

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [username, setUsername] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <View style={loginstyles.container}>
      <Image source={require('../../assets/images/logo.png')} style={loginstyles.logo} />

      <Text style={[loginstyles.header, { marginBottom: 20 }]}>Sign up to HabitFlow</Text>

      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Username</Text>
      <TextInput style={[loginstyles.input, { marginBottom: 15 }]} placeholder="Enter a username" onChangeText={setUsername} />

      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Email</Text>
      <TextInput style={[loginstyles.input, { marginBottom: 15 }]} placeholder="Enter your email" keyboardType="email-address" value={email} onChangeText={setEmail} />

      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Password</Text>
      <TextInput style={[loginstyles.input, { marginBottom: 15 }]} placeholder="Enter your password" secureTextEntry={true} value={password} onChangeText={setPassword} />

      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Confirm Password</Text>
      <TextInput style={[loginstyles.input, { marginBottom: 20 }]} placeholder="Enter your password again" secureTextEntry={true} value={confirm} onChangeText={setConfirm} />

      <TouchableOpacity onPress={() => signUpUser(email, password, username, confirm, router)} style={[loginstyles.loginButton, { marginBottom: 15 }]}>
        <Text style={loginstyles.loginText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")} style={{ marginBottom: 10 }}>
        <Text style={loginstyles.signupText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const loginstyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#472715",
    marginBottom: 20,
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
  loginButton: {
    width: 350,
    height: 50,
    backgroundColor: "#D0E6C1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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
  orText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7A7A7A",
    marginVertical: 10,
    marginBottom: 20,
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