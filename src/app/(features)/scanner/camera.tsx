import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Button,
} from "react-native";
import { Stack, router, useFocusEffect } from "expo-router";
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import {
  EBAY_OAUTH_TOKEN,
  X_EBAY_C_ENDUSERCTX,
  X_EBAY_C_MARKETPLACE_ID,
} from "@env";

const CameraScreen = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });

  const [isScanning, setIsScanning] = useState(true); // State to control scanning
  const list_items = 10;
  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: async (codes) => {
      if (isScanning) {
        console.log(codes[0].value);
        try {
          const response = await fetch(
            `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${codes[0].value}&limit=${list_items}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${EBAY_OAUTH_TOKEN}`,
                "X-EBAY-C-MARKETPLACE-ID": X_EBAY_C_MARKETPLACE_ID,
                "X-EBAY-C-ENDUSERCTX": X_EBAY_C_ENDUSERCTX,
              },
            }
          );
          console.log(`Bearer ${EBAY_OAUTH_TOKEN}`);
          const data = await response.json();
          console.log(data);
          const data_title = data["itemSummaries"][0]["title"];
          console.log(data_title);
          router.push("/image");
          setIsScanning(false);
        } catch (error) {
          console.error("API request failed");
          setIsScanning(false);
        }
      }
    },
  });

  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);

  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();

  const camera = useRef<Camera>(null);

  const [mode, setMode] = useState("camera");

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
      return () => {
        setIsActive(false);
      };
    }, [hasPermission, microphonePermission])
  );

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

  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    try {
      const result = await fetch(`file://${photo.path}`);
      const data = await result.blob();
      // upload data to your network storage (ex: s3, supabase storage, etc)
    } catch (error) {
      console.error("Failed to upload photo:", error);
    }
  };

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

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
        <Camera
          device={device}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          isActive={
            mode === "barcode" && isActive && isScanning && !photo && !video
          }
        />
      ) : (
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
                setMode(mode === "barcode" ? "camera" : "barcode");
                setIsScanning(true); // Reset scanning state when switching modes
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
    </View>
  );
};

export default CameraScreen;
