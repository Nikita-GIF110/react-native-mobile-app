import React from "react";
import { RecoverPassword } from "@/src/pages/auth";
import { StatusBar } from "expo-status-bar";

export default function RecoverPasswordPage() {
  return (
    <>
      <RecoverPassword />
      <StatusBar style="auto" />
    </>
  );
}
