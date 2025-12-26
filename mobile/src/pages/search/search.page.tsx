import { View } from "react-native";
import {
  useBottomSheetModalRef,
  PageTitle,
  Appbar,
  BackActionButton,
  FilterButton,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import {
  BottomSheetProductFilterForm,
  ProductFilterFormCategoryField,
  ProductFilterFormCityField,
  ProductFilterFormConditionField,
  ProductFilterFormCurrencyField,
  ProductFilterFormLanguageTagField,
  BottomSheetProductFilterFormPriceField,
  ProductFilterFormSortField,
  ProductsFilterProvider,
} from "@/src/features/filter-products";
import { ProductsInfiniteList } from "@/src/widgets/product-list";
import { DebounceSearchbar } from "@/src/widgets/searchbar";
import { CitySwitcher } from "@/src/widgets/city-switcher";
import React from "react";
import { useTranslation } from "react-i18next";
import { CONFIG } from "@/src/shared/config";

export const Search = () => {
  const sheetRef = useBottomSheetModalRef();
  const { t } = useTranslation("pages");
  const i = useSafeAreaInsets();

  return (
    <ProductsFilterProvider>
      <>
        <Appbar style={{ marginTop: i.top }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackActionButton />
            <PageTitle>{t("search_page.title", { ns: "pages" })}</PageTitle>
          </View>

          <CitySwitcher />
        </Appbar>

        <Appbar style={{ marginBottom: 8 }}>
          <DebounceSearchbar
            value=""
            right={() => (
              <FilterButton onPress={() => sheetRef.current?.present()} />
            )}
          />
        </Appbar>

        {/* 
          TODO: ProductsInfiniteList - нагрузка JS в перф мониторе
        */}
        <ProductsInfiniteList
          contentContainerStyle={{
            paddingBottom: i.bottom + CONFIG.TAB_LIST_HEIGHT + 16,
          }}
        />
      </>

      {/*
        TODO: BottomSheet - нагрузка JS в перф мониторе
        TODO: BottomSheetScrollView - нагрузка JS в перф мониторе
        TODO: FilterForm? - нагрузка JS в перф мониторе
      */}
      <BottomSheetProductFilterForm ref={sheetRef}>
        <ProductFilterFormCategoryField />
        <ProductFilterFormCurrencyField />
        <ProductFilterFormCityField />
        <ProductFilterFormLanguageTagField />
        <BottomSheetProductFilterFormPriceField />
        <ProductFilterFormConditionField />
        <ProductFilterFormSortField />
      </BottomSheetProductFilterForm>
    </ProductsFilterProvider>
  );
};
