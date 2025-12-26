import React from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Icon, Text } from "react-native-paper";
import { useShimmerAnimation } from "@/src/shared/lib";
import { hexToRgba, useAppTheme } from "@/src/shared/ui-kit";
import { ProductStatus, ProductModerationStatus } from "@/src/shared/api";
import { useTranslation } from "react-i18next";

type TileAnimation = "scale" | "none";

export const SmallProductTile = ({
  name,
  imageUri,
  price,
  onPress,
  slot,
  moderationStatus,
}: {
  name: string;
  imageUri: string;
  price: string;
  moderationStatus: ProductModerationStatus;
  onPress: () => void;
  animation?: TileAnimation;
  slot: React.ReactNode;
}) => {
  const { colors, borderRadius } = useAppTheme();
  const { t } = useTranslation("product");
  const isRejected = moderationStatus === 2;

  const moderationStatusTextMap: Record<
    ProductModerationStatus,
    string | null
  > = {
    0: "product.on_moderation_status",
    1: null,
    2: "product.rejected_status",
  };
  const moderationStatusColortMap: Record<ProductModerationStatus, string> = {
    0: colors.secondary,
    1: "",
    2: colors.errorContainer,
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={[
          {
            borderRadius: borderRadius.secondary,
            backgroundColor: colors.surface,
          },
          styles.card,
        ]}
      >
        <View
          style={[
            { borderRadius: borderRadius.secondary - 4, overflow: "hidden" },
            styles.image,
          ]}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
          />

          {isRejected && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: hexToRgba(colors.surface, 0.8),
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0.6,
                },
              ]}
            >
              <Icon source="eye-off" size={24} />
            </View>
          )}
        </View>

        <View style={{ paddingVertical: 8, flex: 1 }}>
          <Text
            variant="titleMedium"
            style={{ color: colors.onSurface }}
            numberOfLines={1}
          >
            {name}
          </Text>

          <Text
            variant="titleSmall"
            style={{ color: colors.onSurface, opacity: 0.8 }}
          >
            {price}
          </Text>

          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text
              variant="titleSmall"
              style={{
                color: moderationStatusColortMap[moderationStatus],
                fontWeight: 700,
              }}
            >
              {t(moderationStatusTextMap[moderationStatus], { ns: "product" })}
            </Text>
          </View>
        </View>

        {slot}
      </View>
    </TouchableOpacity>
  );
};

const Skeleton = () => {
  const shimmerStyle = useShimmerAnimation();
  const { colors, borderRadius } = useAppTheme();

  return (
    <View
      style={[
        {
          borderRadius: borderRadius.primary,
          backgroundColor: colors.surface,
        },
        styles.card,
      ]}
    >
      <Animated.View style={[styles.skeleton, styles.image, shimmerStyle]} />
      <View style={{ flex: 1, paddingVertical: 12 }}>
        <Animated.View
          style={[styles.skeleton, styles.titleSkeleton, shimmerStyle]}
        />
        <Animated.View
          style={[styles.skeleton, styles.textSkeleton, shimmerStyle]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 4, height: 95, flexDirection: "row", gap: 8 },
  image: { height: "100%", width: 88 },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  textSkeleton: { width: "90%", height: 10 },
  titleSkeleton: { width: "60%", height: 20 },
});

SmallProductTile.Skeleton = Skeleton;
