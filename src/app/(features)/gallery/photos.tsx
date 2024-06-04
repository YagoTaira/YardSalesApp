import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const storedPhotos = JSON.parse(
        (await AsyncStorage.getItem("photos")) || "[]"
      );
      setPhotos(storedPhotos);
    };
    loadPhotos();
  }, []);

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: `file://${item}` }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 600,
    borderRadius: 8,
  },
});

export default GalleryScreen;
