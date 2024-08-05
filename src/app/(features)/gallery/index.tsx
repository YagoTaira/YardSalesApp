import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Photo Gallery

Welcome to your Photo Gallery! Here you can easily view and manage all the photos you have taken with your camera.

## Features

- **View Your Photos**: Browse through your collection of photos.
- **Delete Unwanted Photos**: Simply tap the trash icon to remove any photo you no longer want to keep.
- **Secure Storage**: Your photos are safely stored and fetched from our secure server.

## How to Use

1. **Open the Gallery**: Tap the "Go to Gallery" button below to access your photos.
2. **View Photos**: Scroll through the gallery to see all your photos.
3. **Delete Photos**: Tap the trash icon on any photo to delete it from your gallery.

Manage your memories with ease in the Photo Gallery!`;

const FeatureDetailsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Menu</Text>
        </TouchableOpacity>
      </View>

      <MarkdownDisplay>{description}</MarkdownDisplay>

      <Link href="/gallery/photos" asChild>
        <Button title="Go to Gallery" />
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
