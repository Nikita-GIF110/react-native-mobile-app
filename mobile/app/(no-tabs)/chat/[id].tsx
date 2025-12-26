import React from "react";
import { Chat } from "@/src/pages/chats";
import { StatusBar } from "expo-status-bar";

export default function ChatPage() {
  return (
    <>
      <Chat />
      <StatusBar style="auto" />
    </>
  );
}
