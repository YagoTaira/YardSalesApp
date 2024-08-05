import { Button, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Notebook

The Notebook feature offers a versatile markdown editor to create, edit, and preview your notes. Designed for ease of use, it allows you to compose text with rich formatting options and switch between editing and preview modes.

## Features

- **Markdown Editing**: Write and format your notes using markdown syntax.
- **Live Preview**: Toggle between edit mode and a live preview to see the formatted text in real time.
- **User-Friendly Interface**: Simple and intuitive design for seamless note-taking and editing.

## How to Use

1. **Open the Notebook**: Tap on the "Go to Notebook" button below to start using the notebook editor.
2. **Edit Mode**: Write your notes using markdown syntax. Use the toolbar to format your text as needed.
3. **Preview Mode**: Switch to preview mode to see how your formatted text will look.
4. **Save and View**: Save your notes and view them anytime in the notebook.

Enhance your productivity with a powerful and easy-to-use markdown editor.`;

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
