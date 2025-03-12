import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../CustomDrawer'; 
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FBFDF4',
            width: '70%',
          },
          drawerActiveBackgroundColor: '#e0eddf',
          drawerActiveTintColor: '#618a38', 
          drawerItemStyle: {
            marginVertical: 5, 
          },
          headerStyle: {
            backgroundColor: '#FBFDF4',
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="home" 
          options={{
            drawerLabel: 'Home',
            headerTitle: 'Home',
            drawerIcon: ({size, color}) => (
              <Ionicons name="home-outline" size={22} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="discussionboard" 
          options={{
            drawerLabel: 'Discussion board',
            title: 'Discussion board',
            drawerIcon: ({size, color}) => (
              <Ionicons name="chatbox-outline" size={22} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="challenges" 
          options={{
            drawerLabel: 'Challenges',
            title: 'Challenge',
            drawerIcon: ({size, color}) => (
              <Ionicons name="flame-outline" size={22} color={color} />
            )
          }}
        />
        <Drawer.Screen
          name="leaderboard" 
          options={{
            drawerLabel: 'Leaderboard',
            title: 'Leaderboard',
            drawerIcon: ({size, color}) => (
              <Ionicons name="sparkles-outline" size={22} color={color} />
            )
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
