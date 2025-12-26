import React from "react";
import { Settings } from "@/src/pages/profile";
import { StatusBar } from "expo-status-bar";

export default function SettingsPage() {
  return (
    <>
      <Settings />
      <StatusBar style="auto" />
    </>
  );
}
