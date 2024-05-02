import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";

const BarcodeScanner = () => {
  return (
    <View>
      <Stack.Screen options={{ title: "Barcode Scanner" }} />
      <Text>Barcode Scanner</Text>
      <Link href="/" asChild>
        <Pressable>
          <Text>Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default BarcodeScanner;
