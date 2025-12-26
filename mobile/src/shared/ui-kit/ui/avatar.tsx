import { Avatar as PaperAvatar } from "react-native-paper";
import { Image } from "react-native";
import React from "react";
import { Animated } from "react-native";
import { useShimmerAnimation } from "../../lib";
import { useAppTheme } from "../models/theme.model";

interface SkeletonProps extends React.ComponentProps<typeof Animated.View> {
  size?: number;
}

interface AvatarProps {
  size?: number;
  isLoading?: boolean;
}

const userDefaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;
const productDefaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/sheet.png")
).uri;

const UserAvatarImageSkeleton = ({ style, size, ...rest }: SkeletonProps) => {
  const shimmerStyle = useShimmerAnimation();

  return (
    <Animated.View
      style={[
        style,
        shimmerStyle,
        {
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
        },
      ]}
      {...rest}
    />
  );
};
export const UserAvatarImage = ({
  source,
  size = 48,
  isLoading,
}: AvatarProps & {
  source?: string | null;
}) => {
  if (isLoading) {
    return <UserAvatarImageSkeleton size={size} />;
  }

  const avatarSourse = source ?? userDefaultAvatar;

  return (
    <Image
      source={{ uri: avatarSourse }}
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
      resizeMode="cover"
    />
  );
};
export const UserAvatarText = ({
  size = 48,
  isLoading,
  label,
}: AvatarProps & {
  label: string;
}) => {
  const { borderRadius, colors } = useAppTheme();

  if (isLoading) {
    return <UserAvatarImageSkeleton size={size} />;
  }

  return (
    <PaperAvatar.Text
      size={size}
      label={label}
      style={{
        backgroundColor: colors.primary,
        borderWidth: 0,
        borderRadius: borderRadius.secondary,
      }}
      labelStyle={{ color: colors.onPrimary }}
    />
  );
};

const ProductAvatarImageSkeleton = ({
  style,
  size,
  ...rest
}: SkeletonProps) => {
  const shimmerStyle = useShimmerAnimation();
  const { borderRadius } = useAppTheme();

  return (
    <Animated.View
      style={[
        style,
        shimmerStyle,
        {
          width: size,
          height: size,
          borderRadius: borderRadius.tertiary,
          backgroundColor: "#e0e0e0",
        },
      ]}
      {...rest}
    />
  );
};
export const ProductAvatarImage = ({
  source,
  size = 48,
  isLoading,
}: AvatarProps & {
  source?: string | null;
}) => {
  const { borderRadius } = useAppTheme();

  if (isLoading) {
    return <ProductAvatarImageSkeleton size={size} />;
  }

  const avatarSourse = source ?? productDefaultAvatar;

  return (
    <Image
      source={{ uri: avatarSourse }}
      width={size}
      height={size}
      style={{ borderRadius: borderRadius.tertiary }}
      resizeMode="cover"
    />
  );
};
