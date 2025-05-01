import React from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  
import { getAuth, signOut } from '@react-native-firebase/auth';  
import { Dimensions } from 'react-native';

function CustomDrawerContent(props) {
  const router = useRouter();
  const currentPath = router.pathname || "";

  const screenHeight = Dimensions.get('window').height;

  const drawerItems = [
    { label: "Home", path: "/home", icon: "home-outline" },
    { label: "Challenges", path: "/challenges", icon: "flame-outline" },
    {label: "Discussion Board",path: "/discussionboard",icon: "chatbox-outline" },
    { label: "Leaderboard", path: "/leaderboard", icon: "sparkles-outline" },
    { label: "Profile", path: "/profile", icon: "person-outline" },
  ];

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("Logged Out", "You have successfully logged out.", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error) {
      console.error("Sign out error: ", error.message);
      alert("Error signing out, please try again!");
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FBFDF4" }}>
      <DrawerContentScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.drawer}>
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
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? "#618a38" : color}
                />
              )}
              labelStyle={{
                fontSize: 18,
                color: isActive ? "#618a38" : "#000",
              }}
              style={{
                backgroundColor: isActive ? '#e0eddf' : 'transparent',
                marginVertical: screenHeight * 0.03, 
                borderRadius: 25,
                paddingLeft: 5,
                marginBottom: 0,
              }}
            />
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.bottomRowContainer}>
        <DrawerItem
          label={() => null}
          onPress={handleSignOut}
          icon={({ color }) => (
            <Ionicons name="log-out-outline" size={30} color={'black'} />
          )}
          style={styles.iconOnlyButton}
        />

        <DrawerItem
          label={() => null}
          onPress={() => router.push("/support")}
          icon={({ color }) => (
            <Ionicons name="help-circle-outline" size={30} color={'black'} />
          )}
          style={styles.iconOnlyButton}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    padding: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerImage: {
    height: 120,
    width: 120,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "white",
    borderColor: "#c7da60",
    borderWidth: 2,
    borderRadius: 500,
  },
  bottomRowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    maxWidth: "90%",
    alignSelf: "center",
  },
  bottomButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 50,
  },
  iconOnlyButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
    alignItems: "center",
  },
});

export default CustomDrawerContent;
