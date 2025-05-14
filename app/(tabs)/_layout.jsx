import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../CustomDrawer'; 
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          drawerStyle: {
            backgroundColor: '#FBFDF4',
            width: '70%',
          },
          drawerActiveBackgroundColor: '#e0eddf',
          drawerActiveTintColor: '#618a38', 
          headerStyle: {
            backgroundColor: '#FBFDF4',
          },
          headerTitleStyle: {
            fontSize: 24,
            paddingLeft:20,
          },
          drawerLabelStyle: {
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.openDrawer()} 
              style={{ paddingLeft: 20 }} 
            >
              <Ionicons name="menu" size={40} color="black" /> 
            </TouchableOpacity>
          ),
        })}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
      </Drawer>
    </GestureHandlerRootView>
  );
}