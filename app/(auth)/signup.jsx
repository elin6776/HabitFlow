import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard } from "react-native";
import loginstyles from '../style/loginstyle';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState(''); // declare email variable
  const [password, setPassword] = useState(''); // declare password variable
  const [username, setUsername] = useState('');
  const [confirm, setConfirm] = useState('');

  const signUp = async () => { // sign up function
    if (!email || !password || !username || !confirm) {
      alert("Please fill out all the information."); // Alert if either field is empty
      return;
    }
    if (password !== confirm) {
      alert("Passwords do not match. Please ensure the password you enter are the same.");
      return;
    }
    try {
      // Get the auth instance from Firebase
      const auth = getAuth(getApp());
      // Create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the home screen after successful signup
      alert("Sign in successfully");
      router.push("/home");
    } catch (error) {
      // Handle errors
      alert("Unable to sign up: " + error.message);
    }
  };

  return (
    <View style={loginstyles.container}>
      <Image source={require('../../assets/images/logo.png')} style={loginstyles.logo} />

      {/* Header */}
      <Text style={[loginstyles.header, { marginBottom: 20 }]}>Sign up to HabitFlow</Text>

      {/* Username Input */}
      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Username</Text>
      <TextInput 
        style={[loginstyles.input, { marginBottom: 15 }]} 
        placeholder="Enter a username"
        secureTextEntry={false}  
        onChangeText={setUsername}
      />

      {/* Email Input */}
      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Email</Text>
      <TextInput 
        style={[loginstyles.input, { marginBottom: 15 }]} 
        placeholder="Enter your email" 
        keyboardType="email-address" // Email keyboard type
        value={email} 
        onChangeText={setEmail} // Update email state
      />

      {/* Password Input */}
      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Password</Text>
      <TextInput 
        style={[loginstyles.input, { marginBottom: 15 }]} 
        placeholder="Enter your password" 
        secureTextEntry={true}  // Secure entry for password
        value={password} 
        onChangeText={setPassword} // Update password state
      />

      {/* Confirm Password Input */}
      <Text style={[loginstyles.label, { marginBottom: 5 }]}>Confirm Password</Text>
      <TextInput 
        style={[loginstyles.input, { marginBottom: 20 }]} 
        placeholder="Enter your password again" 
        secureTextEntry={true}  // Secure entry for confirm password
        value={confirm} 
        onChangeText={setConfirm} // Update confirm password state
      />

      {/* Sign up Button */}
      <TouchableOpacity onPress={signUp} style={[loginstyles.loginButton, { marginBottom: 15 }]}>
        <Text style={loginstyles.loginText}>Sign up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.push("/")} style={{ marginBottom: 10 }}>
        <Text style={loginstyles.signupText}>Already have an account? Log in</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={[loginstyles.orText, { marginBottom: 10 }]}>────────────────OR────────────────</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={loginstyles.googleButton}>
        <Image source={require('../../assets/images/google.png')} style={loginstyles.googleIcon} />
        <Text style={loginstyles.googleText}>Log in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
