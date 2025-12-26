import React from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { useShimmerAnimation } from "@/src/shared/lib";
import { useAppTheme } from "@/src/shared/ui-kit";

type TileAnimation = "scale" | "none";

export const LargeProductTile = ({
  name,
  imageUri,
  price,
  condition,
  location,
  onPress,
  animation = "scale",
  footerSlot,
}: {
  name: string;
  imageUri: string;
  price: string;
  condition: string;
  location: string;
  onPress: () => void;
  animation?: TileAnimation;
  footerSlot: React.ReactNode;
}) => {
  const { colors, borderRadius } = useAppTheme();
  // const Component = animationComponents[animation];
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
        <Image
          source={{ uri: imageUri }}
          style={[{ borderRadius: borderRadius.secondary - 4 }, styles.image]}
        />

        <View style={{ paddingHorizontal: 12 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 4,
              paddingTop: 8,
            }}
          >
            <Text
              variant="titleLarge"
              style={{ color: colors.onSurface, fontWeight: 700 }}
            >
              {price}
            </Text>

            <Text
              variant="titleSmall"
              style={{ color: colors.onSurface, opacity: 0.6 }}
            >
              {condition}
            </Text>
          </View>

          <Text
            variant="titleMedium"
            style={{ color: colors.onSurface }}
            numberOfLines={1}
          >
            {name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text
              variant="titleSmall"
              style={{ color: colors.onSurface, opacity: 0.6, flex: 1 }}
              numberOfLines={1}
            >
              {location}
            </Text>
            {footerSlot}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Skeleton = () => {
  const shimmerStyle = useShimmerAnimation();

  return (
    <Card style={styles.card}>
      <Animated.View style={[styles.skeleton, styles.image, shimmerStyle]} />
      <Card.Content style={{ paddingHorizontal: 4 }}>
        <Animated.View
          style={[styles.skeleton, styles.titleSkeleton, shimmerStyle]}
        />

        <Animated.View
          style={[styles.skeleton, styles.textSkeleton, shimmerStyle]}
        />
        <Animated.View
          style={[styles.skeleton, styles.textSkeleton, shimmerStyle]}
        />
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { padding: 4, height: 274 },
  image: { height: 170 },
  skeleton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  textSkeleton: { width: "90%", height: 10 },
  titleSkeleton: { width: "60%", height: 20 },
});

LargeProductTile.Skeleton = Skeleton;
