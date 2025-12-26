import {
  LikeButton,
  InfiniteQueryFlatList,
  ContentPlaceholder,
} from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem } from "react-native";
import { useProductsFilterContext } from "@/src/features/filter-products";
import type { ProductEntity } from "@/src/shared/api/products";
import { useInfiniteFetchProducts } from "@/src/entities/products";
import { useAuthContext } from "@/src/entities/auth";
import { useLikeProduct } from "../model/product.model";
import { priceFormatter } from "@/src/shared/lib";
import { LargeProductTile } from "@/src/features/product-tile";
import * as Animatable from "react-native-animatable";

export const ProductsInfiniteList = ({
  contentContainerStyle,
  // style,
  ...props
}: Omit<
  React.ComponentProps<typeof InfiniteQueryFlatList>,
  | "data"
  | "keyExtractor"
  | "isLoadingMore"
  | "onLoadMore"
  | "isListLoaded"
  | "renderItem"
  | "getItemLayout"
>) => {
  const router = useRouter();
  const { isAuthorized, redirectToSignIn } = useAuthContext();
  const productLikeQuery = useLikeProduct();
  const { t } = useTranslation("common");
  const { filters } = useProductsFilterContext();

  const {
    products,
    listLoaded,
    refreshControlState,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFetchProducts(filters);

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
                onPress={() => {
                  if (!isAuthorized) {
                    redirectToSignIn({ from: "/" });
                    return;
                  }
                  productLikeQuery.onLikeIt(productId);
                }}
              />
            }
          />
        </Animatable.View>
      );
    },
    [isAuthorized]
  );

  return (
    <InfiniteQueryFlatList
      {...props}
      keyExtractor={(item) => item.id.toString()}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      data={products}
      isListLoaded={listLoaded}
      contentContainerStyle={[{ paddingHorizontal: 16 }, contentContainerStyle]}
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
      {...refreshControlState}
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
