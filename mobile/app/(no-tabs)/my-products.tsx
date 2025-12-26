import React from "react";
import { StatusBar } from "expo-status-bar";
import { ProfileProducts } from "@/src/pages/profile";

export default function MyProductsPage() {
  return (
    <>
      <ProfileProducts />
      <StatusBar style="auto" />
    </>
  );
}
