import {
  InfiniteQueryFlatList,
  ContentPlaceholder,
  IconButton,
  useBottomSheetModalRef,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { ListRenderItem, View } from "react-native";
import type { ProductEntity, ProductStatus } from "@/src/shared/api/products";
import { SmallProductTile } from "@/src/features/product-tile";
import { priceFormatter } from "@/src/shared/lib";
import { BottomSheetChangeProductStatusForm } from "@/src/features/change-product-status-form";
import { useInfiniteFetchProfileProductsByType } from "../model/profile-product.model";
import * as Animatable from "react-native-animatable";

export const ProfileProductsInfiniteList = ({
  contentContainerStyle,
  productStatus,
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
> & { productStatus: ProductStatus }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const {
    data,
    isListLoaded,
    refreshControlState,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteFetchProfileProductsByType(productStatus, true);
  const i = useSafeAreaInsets();

  const [selectedProductIndex, setSelectedProductIndex] =
    React.useState<number>(-1);

  const sheetModalRef = useBottomSheetModalRef();
  const hasFormFields = productStatus === 1 || productStatus === 2;

  const renderItem = React.useCallback<ListRenderItem<ProductEntity>>(
    ({ item, index }) => {
      return (
        <Animatable.View animation="fadeIn" duration={200} useNativeDriver>
          <SmallProductTile
            imageUri={item.image_urls[0]?.url}
            price={priceFormatter(item.price, item.currency)}
            name={item.name}
            moderationStatus={0}
            onPress={() => {
              router.push({
                pathname: "/(no-tabs)/my-product-overview/[id]",
                params: { id: item.id },
              });
            }}
            slot={
              <View style={{ justifyContent: "space-between" }}>
                <IconButton
                  icon="dots-horizontal"
                  variant="transparent"
                  size="sm"
                  onPress={() => {
                    setSelectedProductIndex(index);
                    sheetModalRef.current?.present();
                  }}
                />
                {hasFormFields && (
                  <IconButton
                    icon="pencil"
                    variant="transparent"
                    size="sm"
                    onPress={() => {
                      router.push({
                        pathname: "/(no-tabs)/edit-product/[id]",
                        params: { id: item.id },
                      });
                    }}
                  />
                )}
              </View>
            }
          />
        </Animatable.View>
      );
    },
    []
  );

  return (
    <>
      <InfiniteQueryFlatList
        {...props}
        keyExtractor={(item) => item.id.toString()}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        data={data}
        isListLoaded={isListLoaded}
        contentContainerStyle={[
          { paddingHorizontal: 16, paddingBottom: i.bottom },
          contentContainerStyle,
        ]}
        renderItem={renderItem}
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
                  <SmallProductTile.Skeleton key={index} />
                </Animatable.View>
              ))}
          </>
        }
        {...refreshControlState}
        getItemLayout={(_, index) => ({
          // 95 - ProductTile Height
          length: 95,
          offset: 95 * index,
          index,
        })}
      />

      <BottomSheetChangeProductStatusForm
        ref={sheetModalRef}
        productStatus={productStatus}
        initialValues={{ product_id: data[selectedProductIndex]?.id }}
      />
    </>
  );
};
