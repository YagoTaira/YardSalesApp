import { StatusBar } from "expo-status-bar";
import { StyleSheet, FlatList, Button } from "react-native";
import FeatureList from "../components/core/FeatureList";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

const features = [
  "barcode",
  "recognition",
  "camera",
  "gallery",
  "notebook",
].map((val) => val);

export default function Features() {
  const { signOut } = useAuthenticator();

  return (
    <SafeAreaView edges={["bottom", "top"]} style={{ flex: 1, padding: 20 }}>
      <Stack.Screen options={{ headerShown: false, title: "Features" }} />
      <FlatList
        data={features}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.column}
        numColumns={2}
        renderItem={({ item }) => <FeatureList feature={item} />}
      />

      <StatusBar style="auto" />
      <Button title="Sign out" onPress={() => signOut()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    gap: 10,
    padding: 10,
  },
  column: {
    gap: 10,
  },
});
