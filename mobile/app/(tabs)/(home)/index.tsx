import React from "react";
import { StatusBar } from "expo-status-bar";
import { Home } from "@/src/pages/home";

export default function HomePage() {
  return (
    <>
      <Home />
      <StatusBar style="auto" />
    </>
  );
}
