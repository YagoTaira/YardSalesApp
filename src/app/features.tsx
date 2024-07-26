import { StatusBar } from "expo-status-bar";
import { StyleSheet, FlatList, Button, Pressable, Text } from "react-native";
import FeatureList from "../components/core/FeatureList";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

const features = [
  "barcode",
  "recognition",
  "camera",
  "gallery",
  "notebook",
  "wishlist",
].map((val) => val);

export default function Features() {
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
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: "Features" }} />
      <FlatList
        data={features}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.column}
        numColumns={2}
        renderItem={({ item }) => <FeatureList feature={item} />}
      />

      <StatusBar style="auto" />
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9EDE3",
  },
  content: {
    gap: 10,
  },
  column: {
    gap: 10,
  },
  signOutButton: {
    padding: 10,
    marginBottom: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#9b4521",
    borderRadius: 20,
  },
  signOutText: {
    color: "#9b4521",
    fontSize: 30,
    fontFamily: "AmaticBold",
  },
});
