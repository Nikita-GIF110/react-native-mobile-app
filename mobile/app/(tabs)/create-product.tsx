import React from "react";
import { StatusBar } from "expo-status-bar";
import { CreateProduct, CreateProductIntro } from "@/src/pages/create-product";

export default function CreateProductPage() {
  return (
    <>
      <CreateProductIntro />
      <StatusBar style="auto" />
    </>
  );
}
