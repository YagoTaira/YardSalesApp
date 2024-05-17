import { View, Text, Button } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { Stack } from "expo-router";

const AnimationScreen = () => {
  const animation = useRef<LottieView>(null);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >
      <Stack.Screen options={{ title: "Icon" }} />
      <LottieView
        //autoPlay
        ref={animation}
        style={{
          width: "80%",
          maxWidth: 400,
          height: 200,
        }}
        source={require("@assets/lottie/coffee.json")}
      />
    </View>
  );
};

export default AnimationScreen;
