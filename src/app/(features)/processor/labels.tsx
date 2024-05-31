import React from "react";
import { StyleSheet, View, Text, FlatList, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Label {
  description: string;
  confidence: number;
}

const LabelResultsScreen: React.FC = () => {
  const router = useRouter();
  const { labels } = useLocalSearchParams();
  const labelList: Label[] = JSON.parse(labels as string);

  return (
    <View style={styles.container}>
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
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    </View>
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
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
  },
});

export default LabelResultsScreen;
