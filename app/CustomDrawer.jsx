import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

function CustomDrawerContent(props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.drawerImage}
          />
        </View>

        <DrawerItemList
          {...props}
          // Add a custom style to the drawer items
          itemStyle={styles.drawerItemStyle} // Apply style to drawer items
        />
      </DrawerContentScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerImage: {
    height: 100,
    width: 100,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    borderColor: '#c7da60',
    borderWidth: 2,
    borderRadius: 50,
  },
  drawerTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerItemStyle: {
    marginVertical: 10, // Adds vertical space between items
  },
});

export default CustomDrawerContent;
