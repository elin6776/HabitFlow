import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import loginstyles from '../style/loginstyle';
import { useRouter } from 'expo-router';
import { signUpUser } from '../../src/firebase/firebaseCrud'; // Import Firebase CRUD function

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
