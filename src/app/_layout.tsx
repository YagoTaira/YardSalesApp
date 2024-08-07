import { Slot } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  Inter_900Black,
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";
import {
  AmaticSC_400Regular,
  AmaticSC_700Bold,
} from "@expo-google-fonts/amatic-sc";
import AnimatedSplashScreen from "../components/AnimatedSplashScreen";
import Animated, { FadeIn } from "react-native-reanimated";
import AuthWrapper from "../components/authWrapper";

function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  let [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    InterSemi: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    InterBlack: Inter_900Black,
    Amatic: AmaticSC_400Regular,
    AmaticBold: AmaticSC_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  const showAnimatedSplash = !appReady || !splashAnimationFinished;

  if (showAnimatedSplash) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={() => setSplashAnimationFinished(true)}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }} entering={FadeIn}>
        <AuthWrapper>
          <Slot />
        </AuthWrapper>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
