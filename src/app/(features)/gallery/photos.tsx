import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native";
import { router } from "expo-router";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "../../../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";

interface Photo {
  id: string;
  url: string;
}

const GalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    const user = auth.currentUser;
    if (user) {
      const listRef = ref(storage, `users/${user.uid}/photos`);
      try {
        const res = await listAll(listRef);
        const photoPromises = res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { id: itemRef.name, url };
        });
        const photosList = await Promise.all(photoPromises);
        setPhotos(photosList);
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No user logged in");
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const user = auth.currentUser;
    if (user) {
      const photoRef = ref(storage, `users/${user.uid}/photos/${photoId}`);
      try {
        await deleteObject(photoRef);
        setPhotos(photos.filter((photo) => photo.id !== photoId));
        console.log("Photo deleted successfully");
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
  };

  const renderItem = ({ item }: { item: Photo }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Gallery</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
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
  loadingContainer: {
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
    position: "relative",
  },
  image: {
    width: "100%",
    height: 600,
    borderRadius: 8,
  },
  deleteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default GalleryScreen;
