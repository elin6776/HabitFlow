import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FBFDF4', 
  },
  navWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%', // Ensures the navigation fills the screen
    zIndex: 1000, // Keeps navigation on top
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 50, // Prevents overlap with navigation
  },
});

export default styles;
