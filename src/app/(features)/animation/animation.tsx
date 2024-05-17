import { View, Text, Button } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import { Stack } from "expo-router";

const AnimationScreen = () => {
  const animation = useRef<LottieView>(null);

  return (
    <View>
      <Stack.Screen options={{ title: "Animation" }} />
      <LottieView
        ref={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#eee",
        }}
        source={require("@assets/lottie/coffee.lottie")}
      />

      <Button title="Play" onPress={() => animation.current?.play()} />
      <Button title="Pause" onPress={() => animation.current?.pause()} />
      <Button title="Reset" onPress={() => animation.current?.reset()} />
    </View>
  );
};

export default AnimationScreen;
