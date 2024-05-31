import React, { useEffect, useState, useCallback, useRef } from "react";
import { StyleSheet, View, Text, Button, Pressable, Image } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from "react-native-vision-camera";
import { Stack, useFocusEffect, router } from "expo-router";
import RNFS from "react-native-fs";
import ImageResizer from "@bam.tech/react-native-image-resizer";
import { FontAwesome5 } from "@expo/vector-icons";

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
      const photo = await camera.current.takePhoto();
      setPhoto(photo);
    }
    setIsTakingPhoto(false);
  };

  const goBack = async () => {
    if (camera.current) {
      setPhoto(undefined);
    }
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
        MaxLabels: 10,
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
          pathname: "/processor/labels",
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
            <Pressable style={[styles.tab]} onPress={() => setPhoto(undefined)}>
              <Text style={styles.tabText}>Back</Text>
            </Pressable>
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
          <FontAwesome5
            onPress={() => router.back()}
            name="arrow-left"
            size={25}
            color="white"
            style={{ position: "absolute", top: 50, left: 30 }}
          />
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
});

export default FrameProcessorScreen;
