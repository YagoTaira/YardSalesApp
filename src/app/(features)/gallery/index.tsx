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
      <Stack.Screen options={{ title: "Gallery" }} />
      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/gallery/photos" asChild>
        <Button title="Go to Photos" />
      </Link>
    </SafeAreaView>
  );
};

export default FeatureDetailsScreen;
