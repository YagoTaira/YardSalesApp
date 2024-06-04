import React, { useCallback, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Button,
  Pressable,
} from "react-native";
import { Stack, useFocusEffect, router, Link } from "expo-router";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useCodeScanner,
} from "react-native-vision-camera";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  EBAY_OAUTH_TOKEN,
  X_EBAY_C_ENDUSERCTX,
  X_EBAY_C_MARKETPLACE_ID,
} from "@env";

// Define the interface for items in the list
interface ItemList {
  title: string;
  imageSource: string;
  price: string;
  store: string;
}

const BarcodeScreen: React.FC = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });

  const [isScanning, setIsScanning] = useState(true);
  const [itemList, setItemList] = useState<ItemList[]>([]);
  const [hasNavigated, setHasNavigated] = useState(false); // Flag to prevent multiple navigations
  const num_items = 10; // Number of items to fetch
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: async (codes) => {
      if (isScanning && !hasNavigated) {
        setHasNavigated(true); // Prevent further navigations
        try {
          const response = await fetch(
            `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${codes[0].value}&limit=${num_items}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${EBAY_OAUTH_TOKEN}`,
                "X-EBAY-C-MARKETPLACE-ID": X_EBAY_C_MARKETPLACE_ID,
                "X-EBAY-C-ENDUSERCTX": X_EBAY_C_ENDUSERCTX,
              },
            }
          );
          const data = await response.json();
          console.log(
            "OAuth ending in...",
            EBAY_OAUTH_TOKEN.substring(EBAY_OAUTH_TOKEN.length - 20)
          );

          if (
            data.itemSummaries &&
            Array.isArray(data.itemSummaries) &&
            data.itemSummaries.length > 0
          ) {
            const card_data = data.itemSummaries.map((item: any) => ({
              title: item.title || "Dummy",
              imageSource: item.image ? item.image.imageUrl : "Dummy",
              price: item.price ? item.price.value : "dummy",
              store: item.seller ? item.seller.username : "Dummy",
            }));
            setItemList(card_data);

            router.push({
              pathname: "/barcode/items",
              params: { items: JSON.stringify(card_data) },
            });

            console.log("Successfully scanned!");
          } else {
            setErrorMessage("No search results found.");
            console.log("No search results found.");
          }
        } catch (error) {
          console.log("API request failed:", error);
          setErrorMessage("Failed to fetch data from API.");
        }
      }
    },
  });

  const { hasPermission, requestPermission } = useCameraPermission();

  const [isActive, setIsActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const checkPermissions = async () => {
        try {
          if (!hasPermission) {
            await requestPermission();
          }
        } catch (error) {
          console.error("Failed to get permissions:", error);
        }
      };

      checkPermissions();
      setIsActive(true);
      setHasNavigated(false); // Reset navigation flag when screen gains focus
      setErrorMessage(null); // Reset error message when screen gains focus
      return () => {
        setIsActive(false);
      };
    }, [hasPermission])
  );

  if (!hasPermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found!</Text>;
  }

  const reScan = () => {
    setIsScanning(true);
    setHasNavigated(false);
    setErrorMessage(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        device={device}
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
      />

      <FontAwesome5
        onPress={() => router.back()}
        name="arrow-left"
        size={25}
        color="white"
        style={{ position: "absolute", top: 50, left: 30 }}
      />

      {errorMessage && (
        <>
          <View style={styles.errorMessageContainer}>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={() => reScan()}>
                <Text>Try again</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

// Styles for error message container and text
const styles = StyleSheet.create({
  errorMessageContainer: {
    flexDirection: "column",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  errorTextContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
  errorMessage: {
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default BarcodeScreen;
