import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useShimmerAnimation } from "@/src/shared/lib";
import { useAppTheme, UserAvatarImage } from "@/src/shared/ui-kit";
import { useFetchUserById } from "@/src/entities/user";

const Skeleton = () => {
  const shimmerStyle = useShimmerAnimation();

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <Animated.View
        style={[styles.skeleton, styles.textSkeleton, shimmerStyle]}
      />
      <Animated.View
        style={[styles.skeleton, styles.titleSkeleton, shimmerStyle]}
      />
    </View>
  );
};

export const PreviewUser = ({
  name,
  imageUri,
  onPress,
  isLoading,
}: {
  name: string;
  imageUri: string;
  onPress?: () => void;
  isLoading: boolean;
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
        width: "100%",
      }}
    >
      <UserAvatarImage source={imageUri} isLoading={isLoading} />

      {isLoading ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyLarge"
            numberOfLines={1}
            style={{
              color: colors.onSurface,
              maxWidth: "100%",
              opacity: 0.8,
            }}
          >
            {name}
          </Text>
        </View>
      )}
    </View>
  );
};

export const PreviewUserById = ({ userId }: { userId?: number }) => {
  const { user, isLoaded } = useFetchUserById(userId);

  return (
    <PreviewUser
      name={user?.user_avatar?.name}
      imageUri={user?.user_avatar?.profile_image}
      isLoading={!isLoaded}
    />
  );
};

const styles = StyleSheet.create({
  image: { height: 50, width: 50 },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  textSkeleton: { width: "90%", height: 10 },
  titleSkeleton: { width: "60%", height: 20 },
});
