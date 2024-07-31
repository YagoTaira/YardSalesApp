import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (): Promise<void> => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", "Incorrect login credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#9b4521",
    fontSize: 40,
    fontFamily: "AmaticBold",
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    color: "#9b4521",
    borderColor: "#9b4521",
    fontSize: 25,
  },
});

export default LoginScreen;
