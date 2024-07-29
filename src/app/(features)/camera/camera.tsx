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
import { auth, storage } from "../../../../FirebaseConfig";
import { ref, uploadBytes } from "firebase/storage";

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

        // Get the current user
        const user = auth.currentUser;
        if (!user) {
          console.error("No user logged in");
          return;
        }

        // Convert photo to blob
        const response = await fetch(photo.path);
        const blob = await response.blob();

        // Upload photo to Firebase Storage
        const photoName = `${Date.now()}.jpg`;
        const storageRef = ref(
          storage,
          `users/${user.uid}/photos/${photoName}`
        );
        await uploadBytes(storageRef, blob);

        console.log("Photo uploaded to Firebase");

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
