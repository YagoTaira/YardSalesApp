import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Camera
Take pictures and record products using Reactive Native Vision Camera for future visualization.`;

const FeatureDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Menu</Text>
        </TouchableOpacity>
      </View>
      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/camera/camera" asChild>
        <Button title="Go to Camera" />
      </Link>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default FeatureDetailsScreen;
