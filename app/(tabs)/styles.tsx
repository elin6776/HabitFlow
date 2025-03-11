import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A3BF80', // Corrected color code with #
  },
  menu: {
    position: 'absolute',
    top: 30,
    left: 0,
    backgroundColor: 'green',
    padding: 10,
    width: 150,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default styles;
