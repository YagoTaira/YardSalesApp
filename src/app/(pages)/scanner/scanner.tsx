import { Text, View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function BarcodeScanner() {
  return (
    <View style={styles.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text>Barcode Scanner</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
