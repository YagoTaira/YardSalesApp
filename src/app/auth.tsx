import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Stack } from "expo-router";
import LoginScreen from "../components/loginScreen";
import RegisterScreen from "../components/registerScreen";

const AuthScreen: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isLogin ? "Login" : "Register" }} />
      {isLogin ? <LoginScreen /> : <RegisterScreen />}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.buttonText}>
          {isLogin ? "Need to register?" : "Already have an account?"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F9EDE3",
  },
  button: {
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#9b4521",
    fontFamily: "AmaticBold",
    fontSize: 40,
  },
});

export default AuthScreen;
