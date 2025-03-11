import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges' }} />
      <Tabs.Screen name="discussionboard" options={{ title: 'Leader Board' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
    </Tabs>
  );
}