
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const Navigation = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-screenWidth * 0.7))[0]; 

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -screenWidth * 0.7 : 0, // Slide completely off-screen with 70% of screen width
      duration: 400,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };
  

  return (
    <View style={styles.fullScreenWrapper}>
      {/* Overlay Background when menu is visible */}
      {menuVisible && <View style={styles.overlay} />}

      {/* Hamburger */}
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <FontAwesome name="bars" size={24} color="black" />
      </TouchableOpacity>

      {/* Animated Navigation Menu */}
      <Animated.View style={[styles.container, { transform: [{ translateX: slideAnim }] }]}>
      <Image source={require('../../assets/images/logo.png')}
          style={styles.image}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Animated.timing(slideAnim, {
              toValue: -screenWidth * 0.7,
              useNativeDriver: true,
            }).start(() => {
              router.push('./home');
              setMenuVisible(false); 
            });
          }}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Animated.timing(slideAnim, {
              toValue: -screenWidth * 0.7,
              useNativeDriver: true,
            }).start(() => {
              router.push('/challenges');
              setMenuVisible(false); 
            });
          }}
        >
          <Text style={styles.buttonText}>Challenges</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Animated.timing(slideAnim, {
              toValue: -screenWidth * 0.7,
              useNativeDriver: true,
            }).start(() => {
              router.push('/leaderboard');
              setMenuVisible(false); 
            });
          }}
        >
          <Text style={styles.buttonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Animated.timing(slideAnim, {
              toValue: -screenWidth * 0.7,
              useNativeDriver: true,
            }).start(() => {
              router.push('/discussionboard');
              setMenuVisible(false); 
            });
          }}
        >
          <Text style={styles.buttonText}>Discussion Board</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    zIndex: 900,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 30,
    zIndex: 1001,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%', 
    height: '100%',
    padding: 20, 
    backgroundColor: '#FBFDF4',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 1000,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 10,
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 2, 
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#3498db',
    marginTop: 20,
    marginBottom: 10,
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16, 
  },
});

export default Navigation;