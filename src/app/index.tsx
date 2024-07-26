import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/auth");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Home" }} />
      {user && (
        <>
          <Link href={"/features"} asChild>
            <Pressable style={styles.box}>
              <Text style={styles.welcomeText}>Welcome, {user.email}!</Text>
              <Text style={styles.text}>Start</Text>
            </Pressable>
          </Link>
          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9EDE3",
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F9EDE3",

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#F9EDE3",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    position: "absolute",
    top: 370,
    color: "#9b4521",
    fontSize: 75,
    fontFamily: "AmaticBold",
  },
  welcomeText: {
    position: "absolute",
    top: 150,
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#9b4521",
  },
  signOutButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 35,
  },
  signOutText: {
    color: "#9b4521",
    fontSize: 50,
    fontFamily: "AmaticBold",
  },
});
