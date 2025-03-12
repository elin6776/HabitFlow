import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import loginstyles from '../style/loginstyle';
import Navigation from './layout'; 
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth'
import { FirebaseError } from 'firebase/app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // const signIn = async () => {
  // try{
  //   await auth().signInWithEmailAndPassword(email,password);
  //   alert("Check your email format")
  // }catch(e:any){
  //   const error = e as FirebaseError;
  //   alert("Unable to register" + error.message)
  // }
  // };
  return (
    <View style={loginstyles.container}>
      <Image source={require('../../assets/images/logo.png')} style={loginstyles.logo} />

      {/* Header */}
      <Text style={loginstyles.header}>Login to HabitFlow</Text>

      {/* Username Input */}
      <Text style={loginstyles.label}>Email</Text>
      <TextInput 
        style={loginstyles.input} 
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
      />

      {/* Password Input */}
      <Text style={loginstyles.label}>Password</Text>
      <TextInput 
        style={loginstyles.input} 
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Login Button */}
      {/* Login Button */}
      <TouchableOpacity onPress={() => router.push("/home")} style={loginstyles.loginButton}>
        <Text style={loginstyles.loginText}>Log in</Text>
      </TouchableOpacity>


      {/* Signup Link */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={loginstyles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={loginstyles.orText}>OR</Text>

      {/* Google Login Button */}
      <TouchableOpacity style={loginstyles.googleButton}>
      <Image source={require('../../assets/images/google.png')}style={loginstyles.googleIcon} />
        <Text style={loginstyles.googleText}>Log in with Google</Text>
      </TouchableOpacity>

    </View>
  );
}
