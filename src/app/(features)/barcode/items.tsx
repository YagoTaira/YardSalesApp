import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Define the interface for items in the list
interface ItemList {
  id: string;
  title: string;
  imageSource: string;
  price: string;
  seller: string;
  url: string;
}

// Get the window width for responsive design
const { width: windowWidth } = Dimensions.get("window");

const ItemsScreen: React.FC = () => {
  // Retrieve the items parameter from the URL/search params
  const { items } = useLocalSearchParams<{ items: string }>();
  // Parse the items JSON string into an array of ItemList objects
  const itemList: ItemList[] = items ? JSON.parse(items) : [];
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Function to handle opening the URL
  const handleOpenURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
    }
  };

  const toggleWishlist = (itemId: string) => {
    setWishlist((prevWishlist) => {
      const newWishlist = new Set(prevWishlist);
      if (newWishlist.has(itemId)) {
        newWishlist.delete(itemId);
      } else {
        newWishlist.add(itemId);
      }
      return newWishlist;
    });
    // Here you would typically save the updated wishlist to your storage or backend
  };

  // Function to render each item in the list
  const renderItem = ({ item }: { item: ItemList }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleOpenURL(item.url)}>
        <Image
          source={{ uri: item.imageSource }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.wishlistIcon}
        onPress={() => toggleWishlist(item.id)}
      >
        <Ionicons
          name={wishlist.has(item.id) ? "heart" : "heart-outline"}
          size={45}
          color={wishlist.has(item.id) ? "red" : "black"}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Price: €{item.price}</Text>
      <Text style={styles.seller}>Store: {item.seller}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={itemList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      <View style={styles.returnContainer}>
        <FontAwesome5
          onPress={() => router.back()}
          name="arrow-left"
          size={25}
          color="black"
        />
      </View>
    </SafeAreaView>
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
  seller: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
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
  wishlistIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
  },
});

export default ItemsScreen;
