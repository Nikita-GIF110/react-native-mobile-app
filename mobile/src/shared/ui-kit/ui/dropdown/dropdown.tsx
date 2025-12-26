import React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { View } from "react-native";
import { Menu, Text, Icon } from "react-native-paper";
import { useAppTheme } from "../../models/theme.model";

type DropdownAnchorSize = "sm" | "md" | "lg";
type DropdownAnchorVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "surface";

const SIZE_MAP: Record<
  DropdownAnchorSize,
  React.ComponentProps<typeof TouchableOpacity>["style"]
> = {
  sm: { height: 35 },
  md: { height: 40 },
  lg: { height: 50 },
};
const TEXT_SIZE_MAP: Record<
  DropdownAnchorSize,
  React.ComponentProps<typeof Text>["variant"]
> = {
  sm: "bodySmall",
  md: "bodyMedium",
  lg: "bodyLarge",
};
const DROPDOWN_ANCHOR_VARIANT_MAP: Record<
  DropdownAnchorVariant,
  { backgroundColor: string; textColor: string }
> = {
  primary: {
    backgroundColor: "primary",
    textColor: "onPrimary",
  },
  secondary: {
    backgroundColor: "secondary",
    textColor: "onSecondary",
  },
  tertiary: {
    backgroundColor: "tertiary",
    textColor: "onTertiary",
  },
  error: {
    backgroundColor: "surface",
    textColor: "error",
  },
  surface: {
    backgroundColor: "surface",
    textColor: "onSurface",
  },
};

export const Dropdown = ({
  containerStyle,
  contentStyle,
  ...rest
}: React.ComponentProps<typeof Menu> & {
  containerStyle?: StyleProp<ViewStyle>;
  helperText?: string;
}) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <View style={containerStyle}>
      <Menu
        anchorPosition="bottom"
        {...rest}
        mode="flat"
        contentStyle={[
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.secondary,
            paddingHorizontal: 8,
          },
          contentStyle,
        ]}
      />
    </View>
  );
};

export const DropdownAnchor = ({
  variant = "surface",
  label,
  size = "lg",
  style,
  contentStyle,
  ...touchableOpacityProps
}: {
  label: string;
  size?: DropdownAnchorSize;
  variant?: DropdownAnchorVariant;
  contentStyle?: React.ComponentProps<typeof Text>["style"];
} & React.ComponentProps<typeof TouchableOpacity>) => {
  const { colors, borderRadius } = useAppTheme();
  const variantConfig = DROPDOWN_ANCHOR_VARIANT_MAP[variant];
  const backgroundColor = colors[variantConfig.backgroundColor];
  const textColor = colors[variantConfig.textColor];

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      activeOpacity={0.8}
      style={[
        {
          paddingVertical: 4,
          paddingHorizontal: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          backgroundColor,
          borderRadius: borderRadius.secondary,
        },
        SIZE_MAP[size],
        style,
      ]}
    >
      <Text
        variant={TEXT_SIZE_MAP[size]}
        style={[
          {
            color: textColor,
            marginVertical: 4,
            // maxWidth: icon ? "90%" : "100%",
            // fontWeight: isActive ? 700 : 400,
          },
          contentStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Icon source="chevron-down" color={textColor} size={24} />
    </TouchableOpacity>
  );
};
