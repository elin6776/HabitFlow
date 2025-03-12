import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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
        />
      </DrawerContentScrollView>
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
  drawerTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;