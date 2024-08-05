import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Barcode Scanner

The Barcode Scanner allows you to scan barcodes from various products quickly and efficiently using the React Native Vision Camera. This feature is designed to help you find detailed information about products in real-time, enhancing your shopping and inventory management experience.

## Features

- **Fast and Accurate Scanning**: Utilizes advanced camera capabilities to ensure quick and precise barcode reading.
- **Real-time Product Information**: Instantly retrieve product details upon scanning a barcode, including price, availability, and more.
- **User-Friendly Interface**: Easy-to-use interface with intuitive controls, making the scanning process seamless and straightforward.

## How to Use

1. **Launch the Barcode Scanner**: Tap on the "Go to Barcode Scanner" button below to start scanning.
2. **Scan a Barcode**: Point your device's camera at a barcode. Ensure the barcode fits within the scanning frame for optimal results.
3. **View Product Details**: Once scanned, the app will fetch and display the product information associated with the barcode.

Enhance your shopping experience or streamline your inventory management with our powerful and efficient Barcode Scanner. Start scanning now!`;

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

      <Link href="/barcode/scanner" asChild>
        <Button title="Go to Barcode Scanner" />
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
