import React from "react";
import { StatusBar } from "expo-status-bar";
import { CreateProduct } from "@/src/pages/create-product";

export default function CreateProductPage() {
  return (
    <>
      <CreateProduct />
      <StatusBar style="auto" />
    </>
  );
}
