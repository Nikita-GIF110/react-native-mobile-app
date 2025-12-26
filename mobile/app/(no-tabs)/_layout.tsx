import { Stack } from "expo-router";

export default function NoTabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="chat/[id]" />
      <Stack.Screen name="my-product-overview/[id]" />
      <Stack.Screen name="product-overview/[id]" />
      <Stack.Screen name="user/[id]" />
      <Stack.Screen name="edit-product/[id]" />
      <Stack.Screen name="my-products" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
