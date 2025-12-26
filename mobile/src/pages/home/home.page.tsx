import {
  Logo,
  Appbar,
  FilterButton,
  useBottomSheetRef,
  useBottomSheetModalRef,
  useSafeAreaInsets,
} from "@/src/shared/ui-kit";
import {
  BottomSheetProductFilterForm,
  ProductsFilterProvider,
  ProductFilterFormCategoryField,
  ProductFilterFormCurrencyField,
  ProductFilterFormCityField,
  ProductFilterFormLanguageTagField,
  BottomSheetProductFilterFormPriceField,
  ProductFilterFormConditionField,
  ProductFilterFormSortField,
} from "@/src/features/filter-products";
import { ProductsInfiniteList } from "@/src/widgets/product-list";
import { Searchbar } from "@/src/widgets/searchbar";
import { CitySwitcher } from "@/src/widgets/city-switcher";
import { CategoriesList } from "@/src/features/categories-list";
import {} from "react-native-safe-area-context";
import { CONFIG } from "@/src/shared/config";

export const Home = () => {
  const sheetRef = useBottomSheetModalRef();
  const i = useSafeAreaInsets();

  return (
    <ProductsFilterProvider>
      <Appbar style={{ marginTop: i.top }}>
        <Logo />
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
        ListHeaderComponent={<CategoriesList />}
        contentContainerStyle={{
          paddingBottom: i.bottom + CONFIG.TAB_LIST_HEIGHT + 16,
        }}
      />

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
