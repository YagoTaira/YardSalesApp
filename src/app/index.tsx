import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        setUsername(
          currentUser.email.substring(0, currentUser.email.indexOf("@"))
        );
      }
    });

    return () => unsubscribe();
  }, []);

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
              <Text style={styles.welcome}>Welcome,</Text>
              <Text style={styles.username}>{username}!</Text>
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
    top: 380,
    color: "#9b4521",
    fontSize: 75,
    fontFamily: "AmaticBold",
  },
  welcome: {
    position: "absolute",
    top: 70,
    fontSize: 75,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#9b4521",
    fontFamily: "AmaticBold",
  },
  username: {
    position: "absolute",
    top: 160,
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#9b4521",
    fontFamily: "AmaticBold",
  },
  signOutButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 35,
  },
  signOutText: {
    color: "#9b4521",
    fontSize: 55,
    fontFamily: "AmaticBold",
  },
});
