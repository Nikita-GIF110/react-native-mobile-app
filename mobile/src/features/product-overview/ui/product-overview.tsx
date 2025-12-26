import React from "react";
import {
  Dimensions,
  TouchableWithoutFeedback,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Text } from "react-native-paper";
import {
  hexToRgba,
  useAppTheme,
  LightBox,
  FlatList,
} from "@/src/shared/ui-kit";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { useFetchProductById } from "@/src/entities/products";
import { daysAgo, priceFormatter, useShimmerAnimation } from "@/src/shared/lib";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

export const ProductOverview = ({
  price,
  condition,
  description,
  creationTime,
  images,
  name,
  isLoading = false,
}: {
  images: string[];
  price: string;
  condition: string;
  description: string;
  creationTime: string;
  name: string;
  isLoading?: boolean;
}) => {
  const { colors, borderRadius } = useAppTheme();
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState<number>(0);
  const shimmerStyle = useShimmerAnimation();

  const onToggleVisible = () => setIsVisible((prevState) => !prevState);

  return (
    <>
      <View style={{ position: "relative", marginBottom: 12 }}>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          isListLoaded={!isLoading}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={activeImageIndex}
          renderItem={({ item }) => (
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 294,
                paddingHorizontal: 16,
                marginHorizontal: -16,
              }}
            >
              <TouchableWithoutFeedback onPress={onToggleVisible}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: borderRadius.primary,
                  }}
                  resizeMode="cover"
                />
              </TouchableWithoutFeedback>
            </View>
          )}
          ListLoadingComponent={
            <View
              style={{
                width: SCREEN_WIDTH,
                height: 294,
                paddingHorizontal: 16,
                marginHorizontal: -16,
              }}
            >
              <Animated.View
                style={[
                  {
                    width: "100%",
                    height: "100%",
                    borderRadius: borderRadius.primary,
                    backgroundColor: "#e0e0e0",
                  },
                  shimmerStyle,
                ]}
              />
            </View>
          }
          getItemLayout={(_data, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onScroll={(event) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(contentOffsetX / SCREEN_WIDTH);
            setActiveImageIndex(index);
          }}
        />

        <View
          style={{
            position: "absolute",
            top: 16,
            left: 20,
            backgroundColor: hexToRgba("#000000", 0.4),
            borderRadius: borderRadius.secondary,
            paddingVertical: 8,
            paddingHorizontal: 18,
          }}
        >
          <Text variant="bodyMedium" style={{ color: colors.onSecondary }}>{`${
            activeImageIndex + 1
          } / ${images.length ?? 1}`}</Text>
        </View>

        <LightBox
          data={images}
          visible={isVisible}
          onClose={onToggleVisible}
          onChangeImageIndex={(index) =>
            carouselRef.current?.scrollTo({ index, animated: true })
          }
          activeImageIndex={activeImageIndex}
          keyExtractor={(item) => item}
        />
      </View>

      {/* ProductOverviewDescription */}
      <TouchableOpacity activeOpacity={1}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Text
            variant="headlineMedium"
            style={{ fontWeight: 600, color: colors.onBackground }}
          >
            {price}
          </Text>
          <Text
            variant="bodyLarge"
            style={{ opacity: 0.8, color: colors.onBackground }}
          >
            {condition}
          </Text>
        </View>

        <Text
          variant="titleLarge"
          style={{
            fontWeight: 600,
            color: colors.onBackground,
            opacity: 0.8,
            marginBottom: 12,
          }}
        >
          {name}
        </Text>

        <Text
          variant="bodyLarge"
          style={{
            color: colors.onBackground,
            opacity: 0.8,
            marginBottom: 8,
          }}
        >
          {description}
        </Text>

        <Text
          variant="bodyMedium"
          style={{ color: colors.onBackground, opacity: 0.8 }}
        >
          {creationTime}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export const ProductOverviewById = ({ productId }: { productId?: string }) => {
  const { item: product, isLoaded } = useFetchProductById(productId);
  const { t } = useTranslation("product");
  const images = !product ? [] : product?.image_urls.map((image) => image.url);

  return (
    <ProductOverview
      isLoading={!isLoaded}
      price={priceFormatter(product?.price, product?.currency)}
      condition={t(product?.condition ?? "")}
      description={product?.description ?? ""}
      creationTime={t("product.created_days_ago", {
        days: daysAgo(product?.creationTime),
        ns: "product",
      })}
      images={images}
      name={product?.name ?? ""}
    />
  );
};
