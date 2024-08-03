import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { router } from "expo-router";
import { ref, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, storage } from "../../../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Photo {
  id: string;
  url: string;
}

const GalleryScreen: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPhotos = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const listRef = ref(storage, `users/${user.uid}/photos`);
      try {
        const res = await listAll(listRef);
        if (res.items && res.items.length > 0) {
          const photoPromises = res.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { id: itemRef.name, url };
          });
          const photosList = await Promise.all(photoPromises);
          setPhotos(photosList);
        } else {
          setPhotos([]);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("No user logged in");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

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
    <View testID="photo-item" style={styles.itemContainer}>
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeletePhoto(item.id)}
      >
        <Ionicons
          testID="delete-button"
          name="trash-outline"
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          testID="loading-indicator"
          size="large"
          color="#0000ff"
        />
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
          <Text testID="back-button" style={styles.headerTitle}>
            Description
          </Text>
        </TouchableOpacity>
      </View>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <View testID="empty-container" style={styles.emptyContainer}>
          <Text>Your gallery is empty.</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GalleryScreen;
