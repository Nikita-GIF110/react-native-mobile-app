import { SignIn } from "@/src/pages/auth";
import { StatusBar } from "expo-status-bar";

export default function SignInPage() {
  return (
    <>
      <SignIn />
      <StatusBar style="auto" />
    </>
  );
}
