import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

type IconVarian = "full" | "half" | "outline";

const STAR_ICONS_MAP: Record<
  IconVarian,
  React.ComponentProps<typeof Icon>["source"]
> = {
  full: "star",
  half: "star-half-full",
  outline: "star-outline",
};
const STAR_ICON_COLORS_MAP: Record<IconVarian, string> = {
  full: "#FFBC3B",
  half: "#FFBC3B",
  outline: "#D9D9D9",
};

export const RatingStar = ({
  size = 18,
  variant = "full",
}: {
  size?: number;
  variant?: IconVarian;
}) => {
  return (
    <Icon
      source={STAR_ICONS_MAP[variant]}
      size={size}
      color={STAR_ICON_COLORS_MAP[variant]}
    />
  );
};

export const RatingCounter = ({
  count,
  size = 24,
  ...rest
}: { count: number } & React.ComponentProps<typeof RatingStar>) => {
  return (
    <View
      style={{
        flexDirection: "row",
        // gap: 2,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: size / 1.5 }}>{count}</Text>
      <RatingStar size={size} {...rest} />
    </View>
  );
};
