import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Text,
} from "react-native";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateInputs = (): boolean => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "User account created successfully", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/auth");
          },
        },
      ]);
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = "An unexpected error occurred";
      if (authError.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use";
      } else if (authError.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (authError.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Pressable style={styles.buttonContainer} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </>
      )}
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

export default RegisterScreen;
