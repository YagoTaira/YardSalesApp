import { View, Text, Button } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "@components/MarkdownDisplay";

const description = `
# Authentication
AWS Amplify v6 Authentication.`;

const FeatureDetailsScreen = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Feature: Auhtentication" }} />
      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/authentication/protected" asChild>
        <Button title="Go to Protected Page" />
      </Link>
    </SafeAreaView>
  );
};

export default FeatureDetailsScreen;
