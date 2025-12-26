import React from "react";
import { Profile } from "@/src/pages/profile";
import { StatusBar } from "expo-status-bar";

export default function UserPage() {
  return (
    <>
      <Profile />
      <StatusBar style="auto" />
    </>
  );
}
