import { View, Text, Button } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";

const description = `
# Barcode Scanner
Scan barcode from products using Reactive Native Vision Camera.`;

const FeatureDetailsScreen = () => {
  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Stack.Screen options={{ title: "Description" }} />
      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/barcode/scanner" asChild>
        <Button title="Go to Barcode Scanner" />
      </Link>
    </SafeAreaView>
  );
};

export default FeatureDetailsScreen;
