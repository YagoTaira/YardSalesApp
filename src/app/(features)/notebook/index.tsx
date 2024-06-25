import { Button } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Description" }} />
      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/notebook/editor" asChild>
        <Button title="Go to Notebook" />
      </Link>
    </SafeAreaView>
  );
};

export default FeatureDetailsScreen;
