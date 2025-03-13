import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  // Import useRouter
import { getAuth, signOut } from '@react-native-firebase/auth';  // Import signOut from Firebase

export default function LogOut() {
  const router = useRouter();  // Initialize router

  const handleSignOut = async () => {
    try {
      const auth = getAuth();  // Get the Firebase auth instance
      await signOut(auth);  // Sign out the user
      router.push('/login');  // Redirect to the login screen after sign-out
    } catch (error) {
      console.error("Sign out error: ", error.message);
      alert('Error signing out, please try again!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are logged in!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
