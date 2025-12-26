import React from "react";
import { ProductOverview } from "@/src/pages/product-overview";
import { StatusBar } from "expo-status-bar";

export default function ProductPage() {
  return (
    <>
      <ProductOverview />
      <StatusBar style="auto" />
    </>
  );
}
