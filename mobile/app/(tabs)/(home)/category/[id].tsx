import { StatusBar } from "expo-status-bar";
import { Category } from "@/src/pages/category";
import { ProductsFilterProvider } from "@/src/features/filter-products";

export default function CategoryPage() {
  return (
    <ProductsFilterProvider>
      <Category />
      <StatusBar style="auto" />
    </ProductsFilterProvider>
  );
}
