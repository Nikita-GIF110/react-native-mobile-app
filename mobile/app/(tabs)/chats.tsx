import React from "react";
import { Chats } from "@/src/pages/chats";
import { StatusBar } from "expo-status-bar";

export default function ChatsPage() {
  return (
    <>
      <Chats />
      <StatusBar style="auto" />
    </>
  );
}
