import { TouchableOpacity, View } from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { Text } from "react-native-paper";

interface CheckboxProps {
  value: boolean;
  label: React.ReactNode;
  onChange: (value: CheckboxProps["value"]) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const Checkbox = ({
  value,
  label,
  onChange,
  onFocus,
  onBlur,
}: CheckboxProps) => {
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          if (typeof onFocus === "function") {
            onFocus();
          }
          onChange(!value);
        }}
        onPressOut={onBlur}
        style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
      >
        <Icon name={value ? "checkbox" : "square-outline"} size={18} />
      </TouchableOpacity>

      <Text variant="bodyMedium" style={{ width: "90%" }}>
        {label}
      </Text>
    </View>
  );
};
