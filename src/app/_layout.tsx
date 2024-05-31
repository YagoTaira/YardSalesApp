import { Stack } from "expo-router";
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
import { withAuthenticator } from "@aws-amplify/ui-react-native";
import { getCurrentUser, AuthUser } from "aws-amplify/auth";

import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplifyconfiguration.json";
Amplify.configure(amplifyconfig);

function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setsplashAnimationFinished] = useState(false);
  const [user, setUser] = useState<AuthUser>();

  let [fontsLoaded, fontError] = useFonts({
    Inter: Inter_400Regular,
    InterSemi: Inter_600SemiBold,
    InterBold: Inter_700Bold,
    InterBlack: Inter_900Black,

    Amatic: AmaticSC_400Regular,
    AmaticBold: AmaticSC_700Bold,
  });

  const fetchUser = async () => {
    const res = await getCurrentUser();
    setUser(res);
  };

  useEffect(() => {
    fetchUser();
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  console.log(user?.signInDetails);
  console.log(user?.userId);
  console.log(user?.username);

  const showAnimatedSplash = !appReady || !splashAnimationFinished;
  if (showAnimatedSplash) {
    return (
      <AnimatedSplashScreen
        onAnimationFinish={() => setsplashAnimationFinished(true)}
      />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1 }} entering={FadeIn}>
        <Stack screenOptions={{}}>
          <Stack.Screen name="index" options={{ title: "YardSalesApp" }} />
        </Stack>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

export default withAuthenticator(RootLayout);
