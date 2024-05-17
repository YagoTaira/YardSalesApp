import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  Button,
} from "react-native";
import { Stack, useFocusEffect } from "expo-router";
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

const CameraScreen = () => {
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });
  const codeScanner = useCodeScanner({
    codeTypes: ["ean-13"],
    onCodeScanned: async (codes) => {
      if (codes.length > 0) {
        console.log(codes[0].value);
        try {
          const response = await fetch(
            `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${codes[0].value}&limit=1`,
            {
              method: "GET",
              headers: {
                Authorization:
                  "Bearer v^1.1#i^1#I^3#r^0#f^0#p^1#t^H4sIAAAAAAAAAOVYe2wURRjv9UUIRdSaohWhLkIiuHu7t3u7d5vehaPPK7Q9uGtDC4r7mG3X7u1eduZsD0ioRUpCozRRkYSHBB8BSfABjcgfRiWISiIkSKIYQ2IIqUZNJEQ0SHD2rpRrJYD0Ept4/1zmm2+++f1+830zs0P3Fk9d0F/ff3m6a0r+7l66N9/lYqbRU4uLFt5TkF9elEdnObh29z7WW9hXMFwJpbiREJcDmLBMCCp64oYJxbQxQCRtU7QkqEPRlOIAikgRo6HGpaKHosWEbSFLsQyiIlwdIDiGYQWvh/WwCqN4NA1bzesxY1aA8MoMq8l+Hwf8qiAIXtwPYRKETYgkEwUID+3hSNpLMlyM8YksLdJ+yssI7URFK7ChbpnYhaKJYBqumB5rZ2G9NVQJQmAjHIQIhkO10eZQuLqmKVbpzooVHNEhiiSUhGNbVZYKKlolIwluPQ1Me4vRpKIACAl3MDPD2KBi6DqYu4CflpoXZI7ReKyzwCm8zOdEylrLjkvo1jgci66SWtpVBCbSUep2imI15GeAgkZaTThEuLrC+VuWlAxd04EdIGoWh9pCkQgRbJM6rJik22SbZKtRyQBkZHk16fMCWWF5r0BKnKT5JVkdmSgTbUTmcTNVWaaqO6LBiiYLLQYYNRivjSdLG+zUbDbbIQ05iLL8sFNGQ87PtzuLmlnFJOo0nXUFcSxERbp5+xUYHY2QrctJBEYjjO9ISxQgpERCV4nxnelcHEmfHhggOhFKiG53d3c31c1Slt3h9tA0417RuDSqdIK4RGBfp9Yz/vrtB5B6mooC8EioiyiVwFh6cK5iAGYHEcRSsAI7ovtYWMHx1n8Ysji7x1ZEriqE8bEMz0uch/fzjKoquaiQ4EiSuh0cQJZSZFyyuwBKGJICSAXnWTIObF0VWa/mYX0aIFXer5GcX9NI2avyJKMBQAMgy4rf938qlDtN9ShQbIBykus5y/PUkh65RWiv90m1UVDXFZe5tpa6Na21vK0A0GB1tvjRGqGzfiFvtAXutBpuSr7K0LEyMTx/LgRwaj13ItRbEAF1QvSiipUAEcvQldTkWmDWViOSjVJRYBjYMCGSoUQinJu9Omf0/uU2cXe8c3dG/Ufn001ZQSdlJxcrZzzEAaSETjknEKVYcbdT65aErx+OeXUa9YR46/jmOqlYY5IZtrqauXJSaboUfFahbACtJN6LIdXs3MBiVhcw8XmGbMswgN3KTLie4/EkkmQDTLbCzkGC69IkO2wZgfEKDMPR/gnxUtJH6erJtiXlYisurLvLa7V77Ed+MC/9Y/pcn9J9ro/yXS66kp7HzKUfLS5oKSwoKYc6ApQuaRTUO0z87WoDqgukEhh+fmnexT2v1FeV1zRvXbA2ljq1/XheSdYbw+4n6QdHXxmmFjDTsp4c6Fk3eoqYGTOnezjay3D4tk7T/nZ67o3eQqas8IF5PPv4J7O4SGzDssam4YH56+TfT9HTR51crqK8wj5XXq90fM5OX/U1t/jF4e+XkPN+/OPk6dIrgyeuuHesO1NztKGhv/xsZF/oXXTxpTWHa1dvqvz26I4nvuQWnDgYKQ+XtW1cBA9s2fz+3Auv7xoeaJvja3/jm3PnY58Pv31yv3BoflNZydGHBzeduXrMPxPtPVe5oahpy4ofGq6GVg5TAwNlHzxy74d84Vsz2HdCH69atjNVv3fl/aX7Zm/uHzQurd1V2vz0AO0feDn+s7mdnL2tpPfNdY1f/3Q8tue5Bvjama+8r3q2PrVx2tB9nz107M+D4aFre+qEv9afXbL34KHiK+vPnw5wR1YNVG7+5Tf34V/156mOIZS6vOi7c0P7ma1HXpzyQqVx4NKFxe9ty6zl3440d6P9EQAA",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_IE",
                "X-EBAY-C-ENDUSERCTX":
                  "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>",
              },
            }
          );
          const data = await response.json();
          console.log(data);
          const data_title = data["itemSummaries"][0]["title"];
          console.log(data_title);
        } catch (error) {
          console.error("API request failed");
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
      setIsActive(true);
      return () => {
        setIsActive(false);
      };
    }, [])
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    if (!microphonePermission) {
      requestMicrophonePermission();
    }
  }, [hasPermission, microphonePermission]);

  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }

    const photo = await camera.current?.takePhoto({
      flash,
    });
    console.log(photo);
    setPhoto(photo);
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
        console.error(error);
        setIsRecording(false);
      },
    });
  };

  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    const result = await fetch(`file://${photo.path}`);
    const data = await result.blob();

    // upload data to your network storage (ex: s3, supabase storage, etc)
  };

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found!</Text>;
  }

  console.log(
    "QR camera: ",
    mode === "barcode" && isActive && !photo && !video
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      {mode === "barcode" ? (
        <Camera
          device={device}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          isActive={mode === "barcode" && isActive && !photo && !video}
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
              onPress={() => setMode(mode === "barcode" ? "camera" : "barcode")}
              size={30}
              color="white"
            />
          </View>

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
        </>
      )}
    </View>
  );
};

export default CameraScreen;
