import React from "react";
import { Search } from "@/src/pages/search";
import { StatusBar } from "expo-status-bar";

export default function SearchPage() {
  return (
    <>
      <Search />
      <StatusBar style="auto" />
    </>
  );
}
