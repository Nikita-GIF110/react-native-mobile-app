import React, { createContext, useContext, useMemo, useState } from "react";
import type { ProductFiltesFormField } from "@/src/shared/api";

interface FilterContextProps {
  filters: Partial<ProductFiltesFormField>;
  setFilters: (newFilters: Partial<ProductFiltesFormField>) => void;
  resetFilters: () => void;
  resetFilterParam: (paramKey: keyof ProductFiltesFormField) => void;
}

const FilterContext = createContext<FilterContextProps | null>(null);

export const useProductsFilterContext = () => {
  const ctx = useContext(FilterContext);
  if (!ctx)
    throw new Error(
      "useProductsFilterContext must be used inside ProductsFilterProvider"
    );
  return ctx;
};

export const ProductsFilterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filters, setFiltersState] = useState<FilterContextProps["filters"]>(
    {}
  );

  const setFilters: FilterContextProps["setFilters"] = (fields) =>
    setFiltersState(fields);

  const resetFilterParam: FilterContextProps["resetFilterParam"] = (
    paramKey
  ) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[paramKey];
    setFiltersState(updatedFilters);
  };
  const resetFilters: FilterContextProps["resetFilters"] = () => {
    setFiltersState({});
  };

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters, resetFilterParam }),
    [filters]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};
