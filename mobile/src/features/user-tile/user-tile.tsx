import {
  RatingCounter,
  useAppTheme,
  UserAvatarImage,
} from "@/src/shared/ui-kit";
import { View, StyleSheet, Animated, Image } from "react-native";
import { Text } from "react-native-paper";
import { useFetchUserById } from "@/src/entities/user";
import { useShimmerAnimation } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";

const styles = StyleSheet.create({
  image: { height: 64, width: 64, borderRadius: "50%" },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  textSkeleton: { width: "90%", height: 14 },
  titleSkeleton: { width: "60%", height: 22 },
});

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

const defaultAvatar = Image.resolveAssetSource(
  require("@/assets/images/user.webp")
).uri;

export const UserTile = ({ userId }: { userId?: number }) => {
  const { user, isLoaded } = useFetchUserById(userId);
  const { colors, borderRadius } = useAppTheme();
  const { t } = useTranslation("user");

  const avatarSourse = user?.user_avatar.profile_image ?? defaultAvatar;
  const rating = user?.user_avatar.rate ?? 0;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: borderRadius.secondary,
        backgroundColor: colors.surface,
        gap: 8,
      }}
    >
      <UserAvatarImage source={avatarSourse} isLoading={!isLoaded} />

      {isLoaded ? (
        <View style={{ gap: 4 }}>
          <Text
            variant="titleMedium"
            style={{ color: colors.onSurface, fontWeight: 600 }}
          >
            {user?.user_avatar.name}
          </Text>

          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <RatingCounter count={rating} size={20} />

            <Text style={{ color: colors.onSurface }} variant="bodyMedium">
              {t("user.products_count", { count: 2, ns: "user" })}
            </Text>
          </View>
        </View>
      ) : (
        <Skeleton />
      )}
    </View>
  );
};
