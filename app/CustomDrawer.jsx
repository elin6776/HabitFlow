import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  
import { getAuth, signOut } from '@react-native-firebase/auth';  

function CustomDrawerContent(props) {
  const router = useRouter();
  const currentPath = router.pathname || '';

  const drawerItems = [
    { label: 'Home', path: '/home', icon: 'home-outline' },
    { label: 'Challenges', path: '/challenges', icon: 'flame-outline' },
    { label: 'Discussion Board', path: '/discussionboard', icon: 'chatbox-outline' },
    { label: 'Leaderboard', path: '/leaderboard', icon: 'sparkles-outline' },
  ];

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Logged Out", "You have successfully logged out.", [
        { text: "OK", onPress: () => router.push('/login') }
      ]);
    } catch (error) {
      console.error("Sign out error: ", error.message);
      alert('Error signing out, please try again!');
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FBFDF4' }}>
      <DrawerContentScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.drawerHeader}>
          <Image source={require('../assets/images/logo.png')} style={styles.drawerImage} />
        </View>

        {drawerItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <DrawerItem
              key={item.path}
              label={item.label}
              onPress={() => router.push(item.path)}
              icon={({ color }) => (
                <Ionicons name={item.icon} size={22} color={isActive ? '#618a38' : color} />
              )}
              labelStyle={{
                fontSize: 18,
                color: isActive ? '#618a38' : '#000',
              }}
              style={{
                backgroundColor: isActive ? '#e0eddf' : 'transparent',
                marginVertical: 10,
                borderRadius: 25,
              }}
            />
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          onPress={handleSignOut}
          icon={({ color }) => <Ionicons name="log-out-outline" size={26} color={color} />}
          style={styles.logoutButton}
          labelStyle={styles.logoutLabel}
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
    borderRadius: 25,
  },
});

export default CustomDrawerContent;
