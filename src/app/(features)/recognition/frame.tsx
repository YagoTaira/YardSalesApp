import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
  TakePhotoOptions,
} from "react-native-vision-camera";
import { Stack, useFocusEffect, router } from "expo-router";
import RNFS from "react-native-fs";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import "react-native-get-random-values";

import {
  RekognitionClient,
  DetectLabelsCommand,
} from "@aws-sdk/client-rekognition";
import { Buffer } from "buffer";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from "@env";

interface Label {
  description: string;
  confidence: number;
}

const FrameProcessorScreen: React.FC = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const [photo, setPhoto] = useState<PhotoFile | undefined>();
  const [flash, setFlash] = useState<TakePhotoOptions["flash"]>("off");
  const [isTakingPhoto, setIsTakingPhoto] = useState(true);
  const [labels, setLabels] = useState<Label[]>([]);
  const camera = useRef<Camera>(null);

  global.Buffer = Buffer;

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
    }, [hasPermission])
  );

  const takePhoto = async () => {
    setIsTakingPhoto(true);
    if (camera.current) {
      const photo = await camera.current.takePhoto({ flash });
      setPhoto(photo);
    }
    setIsTakingPhoto(false);
  };

  const processImage = async () => {
    if (!photo) return;

    try {
      const resizedImage = await ImageResizer.createResizedImage(
        `file://${photo.path}`,
        800,
        600,
        "JPEG",
        100
      );

      const imageBase64 = await RNFS.readFile(resizedImage.uri, "base64");

      const rekognitionClient = new RekognitionClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
      });

      const params = {
        Image: {
          Bytes: Buffer.from(imageBase64, "base64"),
        },
        MaxLabels: 40,
        MinConfidence: 70,
      };

      const command = new DetectLabelsCommand(params);
      const response = await rekognitionClient.send(command);
      const labelsData = response.Labels;

      if (labelsData) {
        const labelDescriptions: Label[] = labelsData.map((label: any) => ({
          description: label.Name || "Unknown",
          confidence: label.Confidence || 0,
        }));
        setLabels(labelDescriptions);
        console.log("Labels:", labelDescriptions);
        router.push({
          pathname: "/recognition/labels",
          params: { labels: JSON.stringify(labelDescriptions) },
        });
      }
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  };

  if (!device) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {hasPermission ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo
        />
      ) : (
        <Text>No camera permission</Text>
      )}

      {photo && (
        <>
          <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />

          <View style={styles.buttonContainer}>
            <Pressable style={styles.tab} onPress={processImage}>
              <Text style={styles.tabText}>Process Image</Text>
            </Pressable>
          </View>

          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => setPhoto(undefined)}
              name="arrow-left"
              size={25}
              color="white"
            />
          </View>
        </>
      )}

      {!photo && (
        <>
          <Pressable
            style={{
              position: "absolute",
              alignSelf: "center",
              bottom: 50,
              width: 75,
              height: 75,
              backgroundColor: "white",
              borderRadius: 75,
            }}
            onPress={takePhoto}
          />

          <View style={styles.returnContainer}>
            <FontAwesome5
              onPress={() => router.back()}
              name="arrow-left"
              size={25}
              color="white"
            />
          </View>

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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 10,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  tab: {
    flex: 1,
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  tabText: {
    fontFamily: "InterBold",
    color: "black",
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
});

export default FrameProcessorScreen;
