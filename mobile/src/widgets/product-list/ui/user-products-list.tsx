import { FlatList, ContentPlaceholder, LikeButton } from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem } from "react-native";
import type { ProductEntity } from "@/src/shared/api/products";
import { priceFormatter } from "@/src/shared/lib";
import { useLikeProduct } from "../model/product.model";
import { useUserProducts } from "../model/user-product.model";
import { LargeProductTile } from "@/src/features/product-tile";
import * as Animatable from "react-native-animatable";

export const UserProductsList = ({
  userId,
  contentContainerStyle,
  ...rest
}: { userId?: string } & Omit<
  React.ComponentProps<typeof FlatList>,
  | "data"
  | "keyExtractor"
  | "isLoadingMore"
  | "onLoadMore"
  | "isListLoaded"
  | "renderItem"
  | "getItemLayout"
>) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const productLikeQuery = useLikeProduct();
  const { products, isLoaded } = useUserProducts(userId);

  const renderItem = React.useCallback<ListRenderItem<ProductEntity>>(
    ({ item, index }) => {
      const productId = item.id.toString();
      const upperCondition = item.condition.toUpperCase();

      return (
        <Animatable.View animation="fadeIn" duration={200} useNativeDriver>
          <LargeProductTile
            imageUri={item.image_urls[0]?.url}
            price={priceFormatter(item.price, item.currency)}
            name={item.name}
            condition={upperCondition}
            location={item.location.display_name}
            onPress={() => {
              router.push({
                pathname: "/(no-tabs)/product-overview/[id]",
                params: { id: productId },
              });
            }}
            footerSlot={
              <LikeButton
                isLiked={item.isLiked}
                disabled={productLikeQuery.getIsPending(productId)}
                onPress={() => productLikeQuery.onLikeIt(productId)}
              />
            }
          />
        </Animatable.View>
      );
    },
    []
  );

  return (
    <FlatList
      {...rest}
      keyExtractor={(item) => item.id.toString()}
      data={products}
      isListLoaded={isLoaded}
      contentContainerStyle={[
        { paddingBottom: 8, paddingHorizontal: 16 },
        contentContainerStyle,
      ]}
      ListEmptyComponent={
        <ContentPlaceholder subHeader={t("common.empty_list_text")} />
      }
      ListLoadingComponent={
        <>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <Animatable.View
                key={index}
                animation="fadeIn"
                duration={200}
                useNativeDriver
              >
                <LargeProductTile.Skeleton key={index} />
              </Animatable.View>
            ))}
        </>
      }
      renderItem={renderItem}
      getItemLayout={(_, index) => ({
        // 274 - ProductTile Height
        length: 274,
        offset: 274 * index,
        index,
      })}
    />
  );
};
