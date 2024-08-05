import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
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
  id: string;
  title: string;
  imageSource: string;
  price: string;
  seller: string;
}

const BarcodeScreen: React.FC = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });

  const [isScanning, setIsScanning] = useState(true);
  const [itemList, setItemList] = useState<ItemList[]>([]);
  const [hasNavigated, setHasNavigated] = useState(false); // Flag to prevent multiple navigations
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: async (codes) => {
      if (isScanning && !hasNavigated) {
        setHasNavigated(true); // Prevent further navigations
        try {
          const params = {
            Keyword: codes[0].value,
            Category: "All Categories",
            new: false,
            used: false,
            unspecified: false,
            freeShipping: false,
            localPickup: false,
          };
          const response = await fetch(
            `https://inductive-folio-404523.wl.r.appspot.com/getallitems`,
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(params),
            }
          );

          const data = await response.json();
          const data_count =
            data["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"];
          const data_item =
            data["findItemsAdvancedResponse"][0]["searchResult"][0]["item"];
          if (data_count > 0) {
            var card_data = [];
            for (let i = 0; i < data_count; i++) {
              card_data.push({
                id: data_item[i]["itemId"]
                  ? data_item[i]["itemId"][0]
                  : "Dummy",
                title: data_item[i]["title"]
                  ? data_item[i]["title"][0]
                  : "Dummy",
                imageSource: data_item[i]["galleryURL"]
                  ? data_item[i]["galleryURL"][0]
                  : "Dummy",
                price: data_item[i]["sellingStatus"]
                  ? data_item[i]["sellingStatus"][0]["currentPrice"][0][
                      "__value__"
                    ]
                  : "dummy",
                seller: data_item[i]["storeInfo"]
                  ? data_item[i]["storeInfo"][0]["storeName"][0]
                  : "Dummy",
                url: data_item[i]["viewItemURL"]
                  ? data_item[i]["viewItemURL"][0]
                  : "Dummy",
              });
            }
            setItemList(card_data);

            router.push({
              pathname: "/barcode/items",
              params: { items: JSON.stringify(card_data) },
            });
          } else {
            setErrorMessage("No search results found.");
          }
        } catch (error) {
          setErrorMessage("Failed to fetch data from API.");
        }
      }
    },
  });

  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
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
  }, [hasPermission, requestPermission]);

  const [isActive, setIsActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      setHasNavigated(false);
      setErrorMessage(null);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  if (!hasPermission) {
    return <ActivityIndicator testID="activity-indicator" />;
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
        testID="camera"
        device={device}
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        isActive={isActive}
      />

      <View style={styles.returnContainer}>
        <FontAwesome5
          testID="back-button"
          onPress={() => router.back()}
          name="arrow-left"
          size={25}
          color="white"
        />
      </View>

      {errorMessage && (
        <>
          <View style={styles.errorMessageContainer}>
            <View style={styles.errorTextContainer}>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                testID="rescan-button"
                style={styles.button}
                onPress={() => reScan()}
              >
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

export default BarcodeScreen;
