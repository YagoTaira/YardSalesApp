import { View, Text, Button } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import MarkdownDisplay from "@components/MarkdownDisplay";
import { SafeAreaView } from "react-native-safe-area-context";

const description = `
# Animated Splash Screen
`;

const FeatureDetailsScreen = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Feature: Splashscreen" }} />

      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/animation/animation" asChild>
        <Button title="Go to animation" />
      </Link>

      <Link href="/animation/splash" asChild>
        <Button title="Splash screen animation" />
      </Link>
    </SafeAreaView>
  );
};

export default FeatureDetailsScreen;
