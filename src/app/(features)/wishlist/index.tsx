import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MarkdownDisplay from "../../../components/MarkdownDisplay";
import { Ionicons } from "@expo/vector-icons";

const description = `
# Wishlist

The Wishlist feature allows you to easily save and manage your desired products. Using the Wishlist, you can add items you want to keep track of, view details, and even remove them when needed. This tool is designed to enhance your shopping experience by providing a simple way to manage your favorite items.

## Features

- **Add Items**: Save products to your wishlist for easy access and future reference.
- **View Details**: See detailed information about each item, including title, price, store, and image.
- **Open Links**: Directly open the product's URL to view it on the seller's website.
- **Remove Items**: Easily remove items from your wishlist with a simple tap.

## How to Use

1. **Launch the Wishlist**: Tap on the "Go to Wishlist" button below to view your saved items.
2. **View Items**: Browse through the list of items you have added to your wishlist.
3. **Open Product Links**: Tap on an item image to open the product's URL in your browser.
4. **Remove Items**: Tap on the trash icon to remove an item from your wishlist.

Stay organized and keep track of the products you love with the Wishlist feature.`;

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

      <Link href="/wishlist/items" asChild>
        <Button title="Go to Wishlist" />
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
