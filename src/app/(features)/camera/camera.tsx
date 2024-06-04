import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";

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
        console.log("Photo sucessfully taken!");

        // Save photo locally
        const filePath = `${RNFS.DocumentDirectoryPath}/${photo.path
          .split("/")
          .pop()}`;
        await RNFS.moveFile(photo.path, filePath);

        // Get current photos from AsyncStorage
        const currentPhotos = JSON.parse(
          (await AsyncStorage.getItem("photos")) || "[]"
        );

        // Add new photo path to current photos and save back to AsyncStorage
        const updatedPhotos = [...currentPhotos, filePath];
        await AsyncStorage.setItem("photos", JSON.stringify(updatedPhotos));

        setPhoto(photo);
      } else {
        console.error("Failed to take photo: Photo is undefined");
      }
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
            />
          </View>

          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => router.back()}
              name="arrow-left"
              size={25}
              color="white"
            />
          </View>

          <Pressable
            onPress={onTakePicturePressed}
            onLongPress={onStartRecording}
            style={[
              styles.cameraButton,
              { backgroundColor: isRecording ? "red" : "white" },
            ]}
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
    top: 50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    gap: 30,
  },
  flashContainer: {
    position: "absolute",
    right: 10,
    top: 50,
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
