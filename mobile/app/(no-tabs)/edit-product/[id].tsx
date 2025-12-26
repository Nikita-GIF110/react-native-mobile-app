import React from "react";
import { StatusBar } from "expo-status-bar";
import { ProfileEditProduct } from "@/src/pages/profile";

export default function MyProductsPage() {
  return (
    <>
      <ProfileEditProduct />
      <StatusBar style="auto" />
    </>
  );
}
