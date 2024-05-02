import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link } from "expo-router";

const barcodeScanner = () => {
  return (
    <View>
      <Text>Barcode Scanner</Text>
      <Link href="/" asChild>
        <Pressable>
          <Text>Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default barcodeScanner;
