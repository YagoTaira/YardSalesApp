import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, storage } from "../../../../FirebaseConfig";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";

interface WishlistItem {
  id: string;
  title: string;
  imageSource: string;
  price: string;
  seller: string;
  url: string;
}

const { width: windowWidth } = Dimensions.get("window");

const WishlistScreen: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const loadWishlistItems = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      setLoading(false);
      return;
    }

    const listRef = ref(storage, `users/${user.uid}/wishlist`);
    try {
      const res = await listAll(listRef);
      const items = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const response = await fetch(url);
          const item: WishlistItem = await response.json();
          return item;
        })
      );
      setWishlistItems(items);
    } catch (error) {
      console.error("Error loading wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`Don't know how to open this URL: ${url}`);
    }
  };

  const handleRemoveItem = async (item: WishlistItem) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const user = auth.currentUser;
            if (!user) {
              console.error("No user logged in");
              return;
            }

            const itemRef = ref(
              storage,
              `users/${user.uid}/wishlist/${item.id}.json`
            );
            try {
              await deleteObject(itemRef);
              setWishlistItems(wishlistItems.filter((i) => i.id !== item.id));
            } catch (error) {
              console.error("Error removing item from wishlist:", error);
              Alert.alert("Error", "Failed to remove item. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleOpenURL(item.url)}>
        <Image
          source={{ uri: item.imageSource }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>Price: €{item.price}</Text>
      <Text style={styles.seller}>Store: {item.seller}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.headerTitle}>Wishlist</Text>
        </TouchableOpacity>
      </View>
      {wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>Your wishlist is empty.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    height: windowWidth * 0.5,
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
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  removeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
});

export default WishlistScreen;
