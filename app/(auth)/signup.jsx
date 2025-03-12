import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard } from "react-native";
import loginstyles from '../style/loginstyle';
import { useRouter } from 'expo-router';

export default function Signup() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior="height" // This should help with Android behavior
      style={{ flex: 1 }}
    >
      {/* Wrap the whole screen in TouchableWithoutFeedback to dismiss the keyboard when clicking outside */}
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }} 
          keyboardShouldPersistTaps="handled" // Ensure tapping outside keeps the keyboard closed
        >
          <View style={loginstyles.container}>
            <Image source={require('../../assets/images/logo.png')} style={loginstyles.logo} />

            {/* Header */}
            <Text style={loginstyles.header}>Sign up to HabitFlow</Text>

            {/* Username Input */}
            <Text style={loginstyles.label}>Username</Text>
            <TextInput 
              style={loginstyles.input} 
              placeholder="Enter a username"
              secureTextEntry={false}  // No need for secureTextEntry for username
            />

            {/* Email Input */}
            <Text style={loginstyles.label}>Email</Text>
            <TextInput 
              style={loginstyles.input} 
              placeholder="Enter your email" 
              keyboardType="email-address" // Email keyboard type
            />

            {/* Password Input */}
            <Text style={loginstyles.label}>Password</Text>
            <TextInput 
              style={loginstyles.input} 
              placeholder="Enter your password" 
              secureTextEntry={true}  // Secure entry for password
            />

            {/* Confirm Password Input */}
            <Text style={loginstyles.label}>Confirm Password</Text>
            <TextInput 
              style={loginstyles.input} 
              placeholder="Enter your password again" 
              secureTextEntry={true}  // Secure entry for confirm password
            />

            {/* Sign up Button */}
            <TouchableOpacity style={loginstyles.loginButton}>
              <Text style={loginstyles.loginText}>Sign up</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={loginstyles.signupText}>Already have an account? Log in</Text>
            </TouchableOpacity>

            {/* OR Separator */}
            <Text style={loginstyles.orText}>OR</Text>

            {/* Google Login Button */}
            <TouchableOpacity style={loginstyles.googleButton}>
              <Image source={require('../../assets/images/google.png')} style={loginstyles.googleIcon} />
              <Text style={loginstyles.googleText}>Log in with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
