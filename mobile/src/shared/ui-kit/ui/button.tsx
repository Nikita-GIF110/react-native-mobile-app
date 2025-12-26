import type { ComponentProps, ReactNode } from "react";
import { Icon, Text } from "react-native-paper";
import { useAppTheme } from "../models/theme.model";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import React from "react";
import { Field, useFormState } from "react-final-form";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "transparent"
  | "surface";

const BASE_BUTTON_CONTAINER_SIZE_MAP: Record<
  ButtonSize,
  React.ComponentProps<typeof TouchableOpacity>["style"]
> = {
  sm: { height: 35, paddingHorizontal: 16 },
  md: { height: 40, paddingHorizontal: 16 },
  lg: { height: 50, paddingHorizontal: 16 },
};

const TEXT_SIZE_MAP: Record<
  ButtonSize,
  React.ComponentProps<typeof Text>["variant"]
> = {
  sm: "bodyMedium",
  md: "bodyMedium",
  lg: "titleMedium",
};
const ICON_SIZE_MAP: Record<ButtonSize, number> = {
  sm: 24,
  md: 24,
  lg: 28,
};
const BUTTON_VARIANT_MAP: Record<
  ButtonVariant,
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
  transparent: {
    backgroundColor: "transparent",
    textColor: "primary",
  },
  surface: {
    backgroundColor: "surface",
    textColor: "onSurface",
  },
};

const ACTIVE_OPACITY = 0.8;

export const Button = ({
  title,
  size = "lg",
  variant = "primary",
  style,
  loading,
  disabled,
  active,
  rightSlor,
  leftSlor,
  ...rest
}: Omit<ComponentProps<typeof TouchableOpacity>, "children"> & {
  title?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  constainerStyle?: React.ComponentProps<typeof View>["style"];
  loading?: boolean;
  active?: boolean;
  rightSlor?: ReactNode | React.ComponentProps<typeof Icon>["source"];
  leftSlor?: ReactNode | React.ComponentProps<typeof Icon>["source"];
}) => {
  const { colors, borderRadius } = useAppTheme();
  const variantConfig = BUTTON_VARIANT_MAP[variant];
  const backgroundColor = colors[variantConfig.backgroundColor];
  const textColor = colors[variantConfig.textColor];

  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      disabled={isDisabled}
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          backgroundColor,
          borderRadius: borderRadius.primary,
          // flex: 1,
        },
        style,
        BASE_BUTTON_CONTAINER_SIZE_MAP[size],
        { opacity: isDisabled ? ACTIVE_OPACITY - 0.2 : 1 },
      ]}
      {...rest}
    >
      {typeof leftSlor === "string" && (
        <View style={{ marginBottom: -3 }}>
          <Icon
            source={leftSlor}
            size={ICON_SIZE_MAP[size]}
            color={textColor}
          />
        </View>
      )}
      {typeof leftSlor === "object" && leftSlor}

      <Text
        style={{ color: textColor, fontWeight: active ? 700 : 400 }}
        variant={TEXT_SIZE_MAP[size]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {typeof rightSlor === "string" && (
        <View style={{ marginBottom: -3 }}>
          <Icon
            source={rightSlor}
            size={ICON_SIZE_MAP[size]}
            color={textColor}
          />
        </View>
      )}
      {typeof rightSlor === "object" && rightSlor}
    </TouchableOpacity>
  );
};

const ICON_BUTTON_CONTAINER_SIZE_MAP: Record<
  ButtonSize,
  React.ComponentProps<typeof TouchableOpacity>["style"]
> = {
  sm: { height: 35, width: 35 },
  md: { height: 40, width: 40 },
  lg: { height: 50, width: 50 },
};
export const IconButton = ({
  size = "lg",
  style,
  variant = "primary",
  icon,
  iconColor,
  disabled,
  onPress,
  ...rest
}: {
  icon: React.ComponentProps<typeof Icon>["source"];
  iconColor?: React.ComponentProps<typeof Icon>["color"];
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
} & ComponentProps<typeof TouchableOpacity>) => {
  const { colors } = useAppTheme();
  const variantConfig = BUTTON_VARIANT_MAP[variant];

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      style={[
        {
          backgroundColor: colors[variantConfig.backgroundColor],
          width: "auto",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        },
        style,
        ICON_BUTTON_CONTAINER_SIZE_MAP[size],
        disabled && { opacity: ACTIVE_OPACITY - 0.2 },
      ]}
      onPress={disabled ? undefined : onPress}
      {...rest}
    >
      <Icon
        source={icon}
        size={ICON_SIZE_MAP[size]}
        color={iconColor ?? colors[variantConfig.textColor]}
      />
    </TouchableOpacity>
  );
};

// Extended Buttons
export const LikeButton = ({
  isLiked,
  style,
  icon = "heart",
  ...rest
}: React.ComponentProps<typeof IconButton> & {
  isLiked: boolean;
}) => {
  const { colors } = useAppTheme();

  return (
    <IconButton
      style={[{ backgroundColor: "transparent" }, style]}
      iconColor={isLiked ? colors.onErrorContainer : colors.onSurface}
      icon={icon}
      {...rest}
    />
  );
};

export const BackActionButton = ({
  onPress,
  icon = "chevron-left",
  ...rest
}: ComponentProps<typeof IconButton>) => {
  const router = useRouter();

  return (
    <IconButton
      icon={icon}
      onPress={typeof onPress === "function" ? onPress : router.back}
      variant="transparent"
      size="sm"
      {...rest}
    />
  );
};

export const FilterButton = (props: ComponentProps<typeof IconButton>) => {
  const { colors } = useAppTheme();

  return (
    <IconButton
      icon="filter-outline"
      style={[{ backgroundColor: "transparent" }]}
      iconColor={colors.onSurface}
      {...props}
    />
  );
};

export const FormFieldButton = ({
  name,
  style,
  variant = "surface",
  value,
  ...rest
}: { name: string; value: string } & React.ComponentProps<typeof Button>) => {
  const form = useFormState();
  const selectedValue = form.values[name] as string | undefined;

  return (
    <Field name={name}>
      {({ input }) => {
        return (
          <Button
            {...rest}
            variant={variant}
            style={[{ justifyContent: "space-between" }, style]}
            onPress={() => input.onChange(value)}
            onPressIn={() => input.onFocus()}
            onPressOut={() => input.onBlur()}
            active={selectedValue === value}
          />
        );
      }}
    </Field>
  );
};

export const SwitchButton = ({
  title,
  size = "lg",
  variant = "primary",
  style,
  disabled,
  active,
  ...rest
}: Omit<ComponentProps<typeof TouchableOpacity>, "children"> & {
  title?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  constainerStyle?: React.ComponentProps<typeof View>["style"];
  active?: boolean;
}) => {
  const { colors, borderRadius } = useAppTheme();
  const variantConfig = BUTTON_VARIANT_MAP[variant];
  const backgroundColor = colors[variantConfig.backgroundColor];
  const textColor = colors[variantConfig.textColor];
  const isDisabled = disabled;

  return (
    <TouchableOpacity
      activeOpacity={ACTIVE_OPACITY}
      disabled={isDisabled}
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
          backgroundColor,
          borderRadius: borderRadius.secondary,
          // flex: 1,
        },
        style,
        BASE_BUTTON_CONTAINER_SIZE_MAP[size],
        { opacity: isDisabled ? ACTIVE_OPACITY - 0.2 : 1 },
      ]}
      {...rest}
    >
      <Text
        style={{ color: textColor, fontWeight: active ? 700 : 400 }}
        variant={TEXT_SIZE_MAP[size]}
      >
        {title}
      </Text>

      <View
        style={{
          width: "16%",
          height: "60%",
          position: "relative",
          padding: 2,
        }}
      >
        <View
          style={[
            {
              backgroundColor: colors.primary,
              borderRadius: 40,
              opacity: active ? 0.2 : 0.1,
            },
            StyleSheet.absoluteFill,
          ]}
        />

        <View
          style={[
            {
              backgroundColor: colors.primary,
              borderRadius: "50%",
              width: "60%",
              height: "100%",
              opacity: active ? 1 : 0.2,
              transform: [{ translateX: active ? "69%" : 0 }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};
