import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import loginstyles from '../style/loginstyle';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); 

  const signIn = async () => {
    try {
      const auth = getAuth(getApp());
      console.log(`Auth instance: ${auth} - Email: ${email} - Password: ${password}`);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //console.log(`User signed in successfully: ${user.password}`);
      console.log("Signed in user:", user.uid);
      alert("Sign in successfully");
      router.push("/home");

    } catch (error) {
      // Handle error cases with specific messages
      console.error("Login error:", error.code, error.message);
      if (error.code === 'auth/invalid-email') {
        alert("The email you entered is invalid. Please check and enter a valid email address.");
      } else if (error.code === 'auth/wrong-password') {
        alert("The password you entered is incorrect. Please try again.");
      } else if (error.code === 'auth/invalid-credential') {
        alert("Invalid credential. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        alert("Unable to find a user with this email. Please check the information or register.");
      } else {
        alert("Unable to log in: " + error.message);
      }
    }
  };

  return (
    <View style={loginstyles.container}>
      {/* App logo */}
      <Image source={require('../../assets/images/logo.png')} style={loginstyles.logo} />

      {/* Header */}
      <Text style={loginstyles.header}>Login to HabitFlow</Text>

      {/* Email Text Field */}
      <Text style={loginstyles.label}>Email</Text>
      <TextInput 
        style={loginstyles.input} 
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
      />

      {/* Password Input */}
      <Text style={loginstyles.label}>Password</Text>
      <TextInput 
        style={loginstyles.input} 
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCompleteType="password"
        textContentType="password"
      />

      {/* Login Button */}
      <TouchableOpacity onPress={signIn} style={loginstyles.loginButton}>
        <Text style={loginstyles.loginText}>Log in</Text>
      </TouchableOpacity>

      {/* Sign-up Link */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={loginstyles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={loginstyles.orText}>────────────────OR────────────────</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={loginstyles.googleButton}>
        <Image source={require('../../assets/images/google.png')} style={loginstyles.googleIcon} />
        <Text style={loginstyles.googleText}>Log in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}