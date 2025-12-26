import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="change-name" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="change-photo" />
    </Stack>
  );
}