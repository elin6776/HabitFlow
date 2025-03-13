import { StyleSheet } from 'react-native';

// Styles
const loginstyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#472715",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "bold",
    color: "#4D4D4D",
    marginBottom: 5,
  },
  input: {
    width: 350,
    height: 50,
    backgroundColor: "#EDEDED",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loginButton: {
    width: 350,
    height: 50,
    backgroundColor: "#D0E6C1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  signupText: {
    color: "#3468C0",
    textDecorationLine: "underline",
    marginBottom: 20,
  },
  orText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7A7A7A",
    marginVertical: 10,
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  googleIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
export default loginstyles; 