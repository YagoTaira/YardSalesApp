import { View } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
import Animated, { ZoomOut } from "react-native-reanimated";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

const AnimatedSplashScreen = ({
  onAnimationFinish = () => {},
}: {
  onAnimationFinish?: () => void;
}) => {
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
      <AnimatedLottieView
        exiting={ZoomOut}
        autoPlay
        ref={animation}
        onAnimationFinish={onAnimationFinish}
        loop={false}
        style={{
          width: "80%",
          maxWidth: 400,
          height: 200,
        }}
        source={require("@assets/lottie/coffee.lottie")}
      />
    </View>
  );
};

export default AnimatedSplashScreen;
