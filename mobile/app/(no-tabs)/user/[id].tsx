import React from "react";
import { UserOverview } from "@/src/pages/user-overview";
import { StatusBar } from "expo-status-bar";

export default function UserPage() {
  return (
    <>
      <UserOverview />
      <StatusBar style="auto" />
    </>
  );
}
