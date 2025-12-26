import React from "react";
import { StatusBar } from "expo-status-bar";
import { ChangeProfilePassword } from "@/src/pages/profile";

export default function ChangePasswordPage() {
  return (
    <>
      <ChangeProfilePassword  />
      <StatusBar style="auto" />
    </>
  );
}
