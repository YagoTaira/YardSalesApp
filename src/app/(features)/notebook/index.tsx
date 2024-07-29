import { Button, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Notebook

Integrate Markdown Notebook content in **React Native**

📚 Today's Agenda:
- Introduction to Markdown
- Markdown Syntax Overview
- Setting Up React Native for Markdown
- Implementing Markdown Rendering
- Styling Markdown Content
- Using Markdown in React Native Components
- Recap and Q&A Session
`;

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

      <Link href="/notebook/editor" asChild>
        <Button title="Go to Notebook" />
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
