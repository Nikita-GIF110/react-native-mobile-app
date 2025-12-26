import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useShimmerAnimation } from "@/src/shared/lib";
import { ProductAvatarImage, useAppTheme } from "@/src/shared/ui-kit";
import { useFetchProductById } from "@/src/entities/products";

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

export const PreviewProduct = ({
  name,
  imageUri,
  price,
  onPress,
  isLoading,
  style,
  ...viewProps
}: {
  name: string;
  imageUri: string;
  price: string;
  onPress?: () => void;
  isLoading: boolean;
} & React.ComponentProps<typeof View>) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          gap: 4,
          alignItems: "center",
          width: "100%",
        },
        style,
      ]}
      {...viewProps}
    >
      <ProductAvatarImage source={imageUri} isLoading={isLoading} />

      {isLoading ? (
        <Skeleton />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            variant="bodyLarge"
            numberOfLines={1}
            style={{ color: colors.onSurface, maxWidth: "100%", opacity: 0.8 }}
          >
            {name}
          </Text>

          <Text
            variant="bodyLarge"
            numberOfLines={1}
            style={{ color: colors.onSurface, fontWeight: 700 }}
          >
            {price}
          </Text>
        </View>
      )}
    </View>
  );
};
export const PreviewProductById = ({ productId }: { productId: string }) => {
  const { item, isLoaded } = useFetchProductById(productId);

  return (
    <PreviewProduct
      name={item?.name}
      imageUri={item?.image_urls[0].url}
      price={item?.price}
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
