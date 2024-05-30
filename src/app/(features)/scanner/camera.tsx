import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Button,
} from "react-native";
import { Stack, useFocusEffect, router } from "expo-router";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  PhotoFile,
  TakePhotoOptions,
  useMicrophonePermission,
  VideoFile,
  useCodeScanner,
} from "react-native-vision-camera";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
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

const CameraScreen: React.FC = () => {
  // Initialize the camera device
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });

  // State to control scanning and manage items and navigation
  const [isScanning, setIsScanning] = useState(true);
  const [itemList, setItemList] = useState<ItemList[]>([]);
  const [hasNavigated, setHasNavigated] = useState(false); // Flag to prevent multiple navigations
  const num_items = 5; // Number of items to fetch
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message

  // Set up the barcode scanner
  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: async (codes) => {
      if (isScanning && !hasNavigated) {
        setHasNavigated(true); // Prevent further navigations
        console.log(codes[0].value);
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
          console.log("OAuth", EBAY_OAUTH_TOKEN);
          console.log("API response:", data); // Log the entire response

          // Check if the response contains item summaries
          if (
            data.itemSummaries &&
            Array.isArray(data.itemSummaries) &&
            data.itemSummaries.length > 0
          ) {
            // Map the data to the card_data structure
            const card_data = data.itemSummaries.map((item: any) => ({
              title: item.title || "Dummy",
              imageSource: item.image ? item.image.imageUrl : "Dummy",
              price: item.price ? item.price.value : "dummy",
              store: item.seller ? item.seller.username : "Dummy",
            }));
            console.log("Card data:", card_data);
            setItemList(card_data);

            // Navigate to item-list screen with the card_data
            router.push({
              pathname: "/scanner/item-list",
              params: { items: JSON.stringify(card_data) },
            });
          } else {
            // Handle the case where no search results are found
            setErrorMessage("No search results found.");
            console.error("No search results found.");
          }
        } catch (error) {
          // Handle API request failure
          console.error("API request failed:", error);
          setErrorMessage("Failed to fetch data from API.");
        }
        setIsScanning(false); // Stop scanning
      }
    },
  });

  // Request camera and microphone permissions
  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);

  // State for storing photo and video files
  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();

  // Camera reference
  const camera = useRef<Camera>(null);

  // State to switch between camera and barcode mode
  const [mode, setMode] = useState<"camera" | "barcode">("camera");

  // Handle screen focus and permissions
  useFocusEffect(
    useCallback(() => {
      const checkPermissions = async () => {
        try {
          if (!hasPermission) {
            await requestPermission();
          }
          if (!microphonePermission) {
            await requestMicrophonePermission();
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
    }, [hasPermission, microphonePermission])
  );

  // Handle taking a picture
  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }

    try {
      const photo = await camera.current?.takePhoto({
        flash,
      });
      console.log(photo);
      setPhoto(photo);
    } catch (error) {
      console.error("Failed to take photo:", error);
    }
  };

  // Handle starting video recording
  const onStartRecording = () => {
    if (!camera.current) {
      return;
    }
    setIsRecording(true);
    camera.current.startRecording({
      flash: flash === "on" ? "on" : "off",
      onRecordingFinished: (video) => {
        console.log(video);
        setIsRecording(false);
        setVideo(video);
      },
      onRecordingError: (error) => {
        console.error("Recording error:", error);
        setIsRecording(false);
      },
    });
  };

  // Handle photo upload
  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    try {
      const result = await fetch(`file://${photo.path}`);
      const data = await result.blob();
      // Upload data to your network storage (ex: s3, supabase storage, etc)
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }
  };

  // Render loading indicator if permissions are not granted
  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  // Render message if camera device is not found
  if (!device) {
    return <Text>Camera device not found!</Text>;
  }

  console.log(
    "QR camera: ",
    mode === "barcode" && isActive && isScanning && !photo && !video
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {mode === "barcode" ? (
        // Render barcode scanner
        <Camera
          device={device}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          isActive={
            mode === "barcode" && isActive && isScanning && !photo && !video
          }
        />
      ) : (
        // Render camera
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive && !photo && !video && mode === "camera"}
          photo
          video
          audio
        />
      )}

      {video && (
        <>
          {/* Render video player */}
          <Video
            style={StyleSheet.absoluteFill}
            source={{
              uri: video.path,
            }}
            useNativeControls
            isLooping
          />
        </>
      )}

      {photo && (
        <>
          {/* Render photo */}
          <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />
          <FontAwesome5
            onPress={() => setPhoto(undefined)}
            name="arrow-left"
            size={25}
            color="white"
            style={{ position: "absolute", top: 50, left: 30 }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              backgroundColor: "rgba(0, 0, 0, 0.40)",
            }}
          >
            <Button title="upload" onPress={uploadPhoto} />
          </View>
        </>
      )}

      {!photo && !video && (
        <>
          {/* Render camera controls */}
          <View
            style={{
              position: "absolute",
              right: 10,
              top: 50,
              padding: 10,
              borderRadius: 5,
              backgroundColor: "rgba(0, 0, 0, 0.40)",
              gap: 30,
            }}
          >
            <Ionicons
              name={flash === "off" ? "flash-off" : "flash"}
              onPress={() =>
                setFlash((curValue) => (curValue === "off" ? "on" : "off"))
              }
              size={30}
              color="white"
            />

            <Ionicons
              name={mode === "camera" ? "barcode" : "camera"}
              onPress={() => {
                setMode((prevMode) => {
                  const newMode = prevMode === "barcode" ? "camera" : "barcode";
                  if (newMode === "barcode") {
                    // Reset scanning state when switching back to barcode mode
                    setIsScanning(true);
                    setHasNavigated(false);
                  }
                  return newMode;
                });
              }}
              size={30}
              color="white"
            />
          </View>

          {mode === "camera" && (
            <Pressable
              onPress={onTakePicturePressed}
              onLongPress={onStartRecording}
              style={{
                position: "absolute",
                alignSelf: "center",
                bottom: 50,
                width: 75,
                height: 75,
                backgroundColor: isRecording ? "red" : "white",
                borderRadius: 75,
              }}
            />
          )}
        </>
      )}

      {errorMessage && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

// Styles for error message container and text
const styles = StyleSheet.create({
  errorMessageContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(255, 0, 0, 0.5)",
  },
  errorMessage: {
    color: "white",
    textAlign: "center",
  },
});

export default CameraScreen;
