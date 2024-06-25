import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Label {
  description: string;
  confidence: number;
}

const LabelResultsScreen: React.FC = () => {
  const router = useRouter();
  const { labels } = useLocalSearchParams();
  const labelList: Label[] = JSON.parse(labels as string);

  return (
    <SafeAreaView edges={["bottom", "top"]} style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>Detected Labels:</Text>
      <FlatList
        data={labelList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.label}>
            {item.description} - {item.confidence.toFixed(2)}%
          </Text>
        )}
      />
      <View style={styles.returnContainer}>
        <FontAwesome5
          onPress={() => router.back()}
          name="arrow-left"
          size={25}
          color="white"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    top: 100,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    top: 100,
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
  },
  returnContainer: {
    position: "absolute",
    left: 20,
    top: 70,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    gap: 30,
  },
});

export default LabelResultsScreen;
