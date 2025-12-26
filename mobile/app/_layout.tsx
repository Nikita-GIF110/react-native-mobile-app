import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import "react-native-reanimated";
// import { DEVICE_ID_NAME } from "@/src/shared/config/Constants";
// import { uniqueId } from "@/src/shared/lib/unique-id";
// import {
//   ComposeProvider,
//   ToastContainer,
//   UserAgreementVerificationTool,
// } from "@/src/application";
import "@/src/shared/i18n";
import { ComposeProvider } from "@/src/application";
import { CheckUserAgreement } from "@/src/widgets/check-user-agreement";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const checkDeviceId = () => {
  // if (SecureStore.getItem(DEVICE_ID_NAME)) {
  //   return;
  // }
  // SecureStore.setItem(DEVICE_ID_NAME, uniqueId());
};
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      checkDeviceId();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ComposeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(no-tabs)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <CheckUserAgreement />
    </ComposeProvider>
  );
}
