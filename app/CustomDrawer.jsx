import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  
import { getAuth, signOut } from '@react-native-firebase/auth';  

function CustomDrawerContent(props) {
  const router = useRouter(); 

  const handleSignOut = async () => {
    try {
      const auth = getAuth();  
      await signOut(auth);  
    
      Alert.alert(
        "Logged Out", 
        "You have successfully logged out.", 
        [{ text: "OK", onPress: () => router.push('/login') }]
      );
    } catch (error) {
      console.error("Sign out error: ", error.message);
      alert('Error signing out, please try again!');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>

        <View style={styles.drawerHeader}>
          <Image source={require('../assets/images/logo.png')} style={styles.drawerImage} />
        </View>


        <DrawerItemList {...props} />
      </DrawerContentScrollView>


      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          onPress={handleSignOut} // Trigger sign out
          icon={({ size, color }) => <Ionicons name="log-out-outline" size={26} color={color} />} // Icon size updated
          style={styles.logoutButton} // Style for the button
          labelStyle={styles.logoutLabel} // Style for the label
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 30,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerImage: {
    height: 120,
    width: 120,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderColor: '#c7da60',
    borderWidth: 2,
    borderRadius: 500,
  },
  logoutContainer: {
    paddingVertical: 15,
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    width: '80%',
    alignSelf: 'center',
  },
  logoutButton: {
    marginLeft: -10,  
  },
  logoutLabel: {
    fontSize: 18,
    borderRadius: 25
  },
});

export default CustomDrawerContent;
