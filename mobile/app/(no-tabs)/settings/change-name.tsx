import React from "react";
import { StatusBar } from "expo-status-bar";
import { ChangeProfileName } from "@/src/pages/profile";

export default function ChangeNamePage() {
  return (
    <>
      <ChangeProfileName />
      <StatusBar style="auto" />
    </>
  );
}
