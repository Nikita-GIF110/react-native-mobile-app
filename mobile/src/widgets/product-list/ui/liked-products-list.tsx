import {
  LikeButton,
  InfiniteQueryFlatList,
  ContentPlaceholder,
} from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem } from "react-native";
import type { ProductEntity } from "@/src/shared/api/products";
import { useAuthContext } from "@/src/entities/auth";
import {
  useInfiniteFetchLikedProducts,
  useLikeProduct,
} from "../model/liked-product.model";
import { LargeProductTile } from "@/src/features/product-tile";
import * as Animatable from "react-native-animatable";

export const LikedProductsInfiniteList = ({
  contentContainerStyle,
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
  const { t } = useTranslation("pages");

  const {
    products,
    listLoaded,
    refreshControlState,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFetchLikedProducts();

  const renderItem = React.useCallback<ListRenderItem<ProductEntity>>(
    ({ item, index }) => {
      const productId = item.id.toString();
      return (
        <Animatable.View animation="fadeIn" duration={200} useNativeDriver>
          <LargeProductTile
            imageUri={item.image_urls[0]?.url}
            price={item.price.toLocaleString("ru-RU")}
            name={item.name}
            condition={item.condition}
            location={item.location.suburb}
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
    [isAuthorized, products]
  );

  return (
    <InfiniteQueryFlatList
      {...props}
      keyExtractor={(item) => item.id.toString()}
      isLoadingMore={isFetchingNextPage}
      onLoadMore={fetchNextPage}
      data={products}
      isListLoaded={listLoaded}
      contentContainerStyle={[
        { paddingBottom: 16, paddingHorizontal: 16 },
        contentContainerStyle,
      ]}
      ListEmptyComponent={
        <ContentPlaceholder
          subHeader={t("liked_products_page.empty_products_list_text", {
            ns: "pages",
          })}
        />
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
