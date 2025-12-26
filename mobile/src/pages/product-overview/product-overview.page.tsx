import { View, ScrollView, Animated, TouchableOpacity } from "react-native";
import {
  Appbar,
  BackActionButton,
  Button,
  IconCounter,
  SafeAreaView,
  useAppTheme,
  AnimatedHeaderSwitcher,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFetchProductById, useProductReport } from "@/src/entities/products";
import React from "react";
import { UserTile } from "@/src/features/user-tile";
import { PreviewProductById } from "@/src/features/previews";
import { ProductOverviewLikeButton } from "@/src/features/product-overview-like-button";
import { useTranslation } from "react-i18next";
import { ProductOverviewDialog } from "@/src/widgets/product-overview-dialog";
import { ProductOverviewById as ProductOverviewByIdWidget } from "@/src/features/product-overview";
import { LocationOverview } from "@/src/features/map";

export const ProductOverview = () => {
  const { colors } = useAppTheme();
  const { id } = useLocalSearchParams();
  const productId = id.toString();
  const { item: product } = useFetchProductById(productId);
  const i = useSafeAreaInsets();
  const { t } = useTranslation(["common", "buttons"]);
  const { onReport, isPending } = useProductReport();
  const router = useRouter();

  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView edges={["top"]}>
      <Appbar style={{ marginBottom: 8 }}>
        <BackActionButton />

        <AnimatedHeaderSwitcher
          firstComponent={
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                justifyContent: "center",
                flex: 1,
              }}
            >
              <IconCounter icon="eye" count={product?.views ?? 0} />
              <IconCounter icon="heart" count={product?.likes ?? 0} />
            </View>
          }
          secondComponent={<PreviewProductById productId={productId} />}
          scrollY={scrollY}
          threshold={150}
          height={50}
        />
      </Appbar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        // i.bottom + компенсация ProductOverviewDialog и ProductOverviewLikeButton
        contentContainerStyle={{ paddingBottom: i.bottom + 60 }}
      >
        <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
          <ProductOverviewByIdWidget productId={productId} />
        </View>

        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          <LocationOverview location={product?.location} />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/(no-tabs)/user/[id]",
                params: { id: product?.user_id },
              })
            }
          >
            <UserTile userId={product?.user_id} />
          </TouchableOpacity>

          <Button
            disabled={isPending}
            loading={isPending}
            onPress={() => onReport(productId)}
            title={t("buttons.report_item", { ns: "buttons" })}
            variant="error"
          />
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          paddingHorizontal: 16,
          paddingBottom: i.bottom,
          paddingTop: 8,
          width: "100%",
          flexDirection: "row",
          gap: 4,
          backgroundColor: colors.background,
        }}
      >
        <ProductOverviewDialog productId={productId} />
        <ProductOverviewLikeButton productId={productId} />
      </View>
    </SafeAreaView>
  );
};
