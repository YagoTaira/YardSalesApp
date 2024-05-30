import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

// Define the interface for items in the list
interface ItemList {
  title: string;
  imageSource: string;
  price: string;
  store: string;
}

// Get the window width for responsive design
const { width: windowWidth } = Dimensions.get("window");

const ItemListScreen: React.FC = () => {
  // Retrieve the items parameter from the URL/search params
  const { items } = useLocalSearchParams<{ items: string }>();

  // Parse the items JSON string into an array of ItemList objects
  const itemList: ItemList[] = items ? JSON.parse(items) : [];

  // Function to render each item in the list
  const renderItem = ({ item }: { item: ItemList }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.imageSource }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Price: {item.price}</Text>
      <Text style={styles.store}>Store: {item.store}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={itemList} // Data to be rendered in the FlatList
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        renderItem={renderItem} // Function to render each item
      />
    </View>
  );
};

// Styles for the component
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
    height: windowWidth * 0.5, // Image height proportional to window width
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
  store: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
});

export default ItemListScreen;
