import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Alert,
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
} from "react-native-vision-camera";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { auth, storage } from "../../../../FirebaseConfig";
import { ref, uploadBytes } from "firebase/storage";
import * as FileSystem from "expo-file-system";

const CameraScreen: React.FC = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });

  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isRecording, setIsRecording] = useState(false);

  const [photo, setPhoto] = useState<PhotoFile | undefined>();
  const [video, setVideo] = useState<VideoFile | undefined>();

  const camera = useRef<Camera>(null);

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
      if (photo) {
        // Get the current user
        const user = auth.currentUser;
        if (!user) {
          console.error("No user logged in");
          return;
        }

        // Read the file as base64
        const base64 = await FileSystem.readAsStringAsync(photo.path, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Create blob from base64
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", `data:image/jpeg;base64,${base64}`, true);
          xhr.send(null);
        });

        // Upload photo to Firebase Storage
        const photoName = `${Date.now()}.jpg`;
        const storageRef = ref(
          storage,
          `users/${user.uid}/photos/${photoName}`
        );
        await uploadBytes(storageRef, blob as Blob);

        setPhoto(photo);
      } else {
        console.error("Failed to take photo: Photo is undefined");
      }
    } catch (error) {
      console.error("Failed to take photo or upload to Firebase:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      if (error && typeof error === "object" && "code" in error) {
        console.error("Error code:", (error as any).code);
      }
      // Display error to user
      Alert.alert("Error", "Failed to take or upload photo. Please try again.");
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
        setIsRecording(false);
        setVideo(video);
      },
      onRecordingError: (error) => {
        console.error("Recording error:", error);
        setIsRecording(false);
      },
    });
  };

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found!</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive && !photo && !video}
        photo
        video
        audio
        testID="camera"
      />

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
          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => setVideo(undefined)}
              name="arrow-left"
              size={25}
              color="white"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => router.push("gallery/photos")}
            >
              <Text>View Gallery</Text>
            </Pressable>
          </View>
        </>
      )}

      {photo && (
        <>
          <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />
          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => setPhoto(undefined)}
              name="arrow-left"
              size={25}
              color="white"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => router.push("gallery/photos")}
            >
              <Text>View Gallery</Text>
            </Pressable>
          </View>
        </>
      )}

      {!photo && !video && (
        <>
          <View style={styles.flashContainer}>
            <Ionicons
              name={flash === "off" ? "flash-off" : "flash"}
              onPress={() =>
                setFlash((curValue) => (curValue === "off" ? "on" : "off"))
              }
              size={30}
              color="white"
              testID="flash-button"
            />
          </View>

          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => router.back()}
              name="arrow-left"
              size={25}
              color="white"
              testID="back-button"
            />
          </View>

          <Pressable
            onPress={onTakePicturePressed}
            onLongPress={onStartRecording}
            style={[
              styles.cameraButton,
              { backgroundColor: isRecording ? "red" : "white" },
            ]}
            testID="camera-button"
          />
        </>
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
  returnContainer: {
    position: "absolute",
    left: 20,
    top: 70,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    gap: 30,
  },
  flashContainer: {
    position: "absolute",
    right: 10,
    top: 70,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    gap: 30,
  },
  cameraButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 50,
    width: 75,
    height: 75,
    borderRadius: 75,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 30,
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

export default CameraScreen;
