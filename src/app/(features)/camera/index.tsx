import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Camera

The Camera feature allows users to take photos and record videos using the React Native Vision Camera. It supports flash control and integrates with Firebase for storing captured media. This feature is designed for capturing and recording products, making it easy to visualize and review later.

## Features

- **Photo Capture**: Take high-quality photos using the back camera.
- **Video Recording**: Record videos with audio using the built-in microphone.
- **Flash Control**: Toggle the camera flash on or off for better lighting conditions.
- **Media Storage**: Automatically upload captured photos to Firebase Storage for future access.
- **Gallery Access**: View captured photos and videos in the gallery.
- **Real-time Preview**: View the captured photo or recorded video immediately after capturing.

## How to Use

1. **Launch the Camera**: Tap on the "Go to Camera" button below to start using the camera.
2. **Capture a Photo**: Point your device's camera at the product you want to capture and press the capture button.
3. **Record a Video**: Press and hold the capture button to start recording a video. Release the button to stop recording.
4. **Toggle Flash**: Tap the flash icon to turn the flash on or off as needed.
5. **View Media**: After capturing, view the photo or video immediately. Press the "View Gallery" button to see all saved media.

Enhance your application's functionality with the ability to easily capture and store product images and videos.`;

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
