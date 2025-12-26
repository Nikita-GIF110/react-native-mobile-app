import { View } from "react-native";
import {
  useBottomSheetModalRef,
  Appbar,
  BackActionButton,
  FilterButton,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import {
  BottomSheetProductFilterForm,
  ProductFilterFormCityField,
  ProductFilterFormConditionField,
  ProductFilterFormCurrencyField,
  ProductFilterFormLanguageTagField,
  BottomSheetProductFilterFormPriceField,
  ProductFilterFormSortField,
  ProductFilterFormSubCategoryField,
  useProductsFilterContext,
} from "@/src/features/filter-products";
import { ProductsInfiniteList } from "@/src/widgets/product-list";
import { Searchbar } from "@/src/widgets/searchbar";
import { CitySwitcher } from "@/src/widgets/city-switcher";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { CategoryTitle } from "@/src/features/category-title";
import { CONFIG } from "@/src/shared/config";

export const Category = () => {
  const sheetRef = useBottomSheetModalRef();
  const { id } = useLocalSearchParams();
  const { setFilters } = useProductsFilterContext();
  const i = useSafeAreaInsets();
  const categoryId = id.toString();

  React.useEffect(() => {
    setFilters({ category: categoryId });
  }, [categoryId]);

  return (
    <>
      <>
        <Appbar style={{ marginTop: i.top }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BackActionButton />
            <CategoryTitle categoryId={categoryId} />
          </View>
          <CitySwitcher />
        </Appbar>

        <Appbar style={{ marginBottom: 8 }}>
          <Searchbar
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
        <ProductFilterFormSubCategoryField />
        <ProductFilterFormCurrencyField />
        <ProductFilterFormCityField />
        <ProductFilterFormLanguageTagField />
        <BottomSheetProductFilterFormPriceField />
        <ProductFilterFormConditionField />
        <ProductFilterFormSortField />
      </BottomSheetProductFilterForm>
    </>
  );
};
