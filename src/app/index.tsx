import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Link, Stack } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Link href={"/features"} asChild>
        <Pressable style={styles.box}>
          <Text style={styles.text}>Start</Text>
        </Pressable>
      </Link>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  box: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#F9EDE3",

    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#9b4521",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#9b4521",
    fontSize: 75,
    fontFamily: "AmaticBold",
  },
});
