import { Button, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Object Recognition

The Object Recognition feature utilizes the React Native Vision Camera to capture photos and identify objects within them using AWS Rekognition. This advanced tool helps you detect and label various objects with high accuracy.

## Features

- **Photo Capture**: Use the camera to take a photo of the scene or object you want to analyze.
- **Object Detection**: The captured photo is processed to detect and label objects using AWS Rekognition.
- **Real-time Feedback**: View the detected objects and their confidence levels immediately after processing.
- **Flash Control**: Toggle the camera flash on or off to improve photo capture in different lighting conditions.

## How to Use

1. **Launch the Object Recognition**: Tap on the "Go to Frame Processor" button below to start the object recognition process.
2. **Capture a Photo**: Point your device's camera at the object you want to recognize and press the capture button.
3. **Process the Image**: After taking the photo, press the "Process Image" button to analyze the photo and identify objects.
4. **View Results**: The app will display the detected objects and their confidence levels.

Enhance your application's functionality with accurate and immediate object recognition.`;

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

      <Link href="/recognition/frame" asChild>
        <Button title="Go to Frame Processor" />
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
