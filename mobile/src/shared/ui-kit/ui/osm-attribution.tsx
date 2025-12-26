import { Platform, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../models/theme.model";
import { openBrowserAsync } from "expo-web-browser";

export const OSMAttribution = () => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      style={{ flexDirection: "row" }}
      activeOpacity={0.6}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          event.preventDefault();
          await openBrowserAsync("https://www.openstreetmap.org/copyright");
        }
      }}
    >
      <Text style={{ color: colors.primary }}>Address data © </Text>
      <Text style={{ textDecorationLine: "underline", color: colors.primary }}>
        OpenStreetMap contributors
      </Text>
    </TouchableOpacity>
  );
};
