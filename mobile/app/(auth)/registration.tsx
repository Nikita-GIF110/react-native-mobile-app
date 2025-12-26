import React from "react";
import { Registration } from "@/src/pages/auth";
import { StatusBar } from "expo-status-bar";

export default function RegistrationPage() {
  return (
    <>
      <Registration />
      <StatusBar style="auto" />
    </>
  );
}
