import React, { useState } from 'react';
import { View, Button, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const Navigation = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-200))[0];

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -200 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={{ position: 'absolute', top: 40, left: 20 }}>
      <TouchableOpacity onPress={toggleMenu}>
        <FontAwesome name="bars" size={24} color="black" />
      </TouchableOpacity>
      <Animated.View
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          width: 150,
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          transform: [{ translateX: slideAnim }],
        }}>
        <Button title="Home" onPress={() => router.push('/')} />
        <Button title="Challenges" onPress={() => router.push('/challenges')} />
        <Button title="Leaderboards" onPress={() => router.push('/leaderboard')} />
        <Button title="Discussion Boards" onPress={() => router.push('/discussionboard')} />
      </Animated.View>
    </View>
  );
};

export default Navigation;
