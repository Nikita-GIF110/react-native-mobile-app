import React from "react";
import { StatusBar } from "expo-status-bar";
import { ProfileProductOverview } from "@/src/pages/profile";

export default function MyProductOverviewPage() {
  return (
    <>
      <ProfileProductOverview />
      <StatusBar style="auto" />
    </>
  );
}
