import { LikedProducts } from "@/src/pages/liked-products";
import { StatusBar } from "expo-status-bar";

export default function LikedProductPage() {
  return (
    <>
      <LikedProducts />
      <StatusBar style="auto" />
    </>
  );
}
