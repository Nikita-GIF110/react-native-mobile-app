import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 100,
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="recover-password" />
    </Stack>
  );
}
