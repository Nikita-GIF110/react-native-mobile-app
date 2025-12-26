import React from "react";
import { StatusBar } from "expo-status-bar";
import { ChangeProfileAvatar } from "@/src/pages/profile";

export default function ChangePhotoPage() {
  return (
    <>
      <ChangeProfileAvatar />
      <StatusBar style="auto" />
    </>
  );
}
