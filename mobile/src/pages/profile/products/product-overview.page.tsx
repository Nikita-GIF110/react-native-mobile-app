import { useFetchProductById } from "@/src/entities/products";
import { BottomSheetChangeProductStatusForm } from "@/src/features/change-product-status-form";
import {
  Appbar,
  BackActionButton,
  Button,
  IconButton,
  PageTitle,
  useBottomSheetModalRef,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { ProductOverviewById as ProductOverviewByIdWidget } from "@/src/features/product-overview";
import { LocationOverview } from "@/src/features/map";
import { BottomSheetSellProductForm } from "@/src/features/sell-product-form";

export const ProfileProductOverview = () => {
  const i = useSafeAreaInsets();
  const { t } = useTranslation("product");
  const { id } = useLocalSearchParams();
  const productId = id.toString();

  const sheetModalRef = useBottomSheetModalRef();
  const sellFormSheetModalRef = useBottomSheetModalRef();

  const { item } = useFetchProductById(productId);

  return (
    <>
      <Appbar style={{ marginTop: i.top }}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <BackActionButton />
          <PageTitle style={{ flex: 1 }} numberOfLines={1}>
            {item?.name ?? ""}
          </PageTitle>
        </View>

        <IconButton
          icon="dots-horizontal"
          variant="transparent"
          onPress={() => sheetModalRef.current?.present()}
        />
      </Appbar>

      <ScrollView
        showsVerticalScrollIndicator={false}
        // scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: i.bottom,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ marginBottom: 16 }}>
          <ProductOverviewByIdWidget productId={productId} />
        </View>

        <View style={{ marginBottom: 16 }}>
          <LocationOverview location={item?.location} />
        </View>

        <Button
          variant="secondary"
          title={t("product.sell_product", { ns: "product" })}
          onPress={() => sellFormSheetModalRef.current?.present()}
        />
      </ScrollView>

      <BottomSheetChangeProductStatusForm
        ref={sheetModalRef}
        productStatus={item?.statement}
        initialValues={{ product_id: item?.id }}
      />

      <BottomSheetSellProductForm
        ref={sellFormSheetModalRef}
        initialValues={{
          product_id: item?.id,
          sell_price: item?.price.toString(),
        }}
      />
    </>
  );
};
