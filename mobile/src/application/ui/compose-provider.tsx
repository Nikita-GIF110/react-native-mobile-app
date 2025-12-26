import React from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/src/shared/ui-kit";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthContextProvider } from "@/src/entities/auth";
import { CheckUserAgreement } from "@/src/features/user-agreement";
import { ToastContainer } from "@/src/features/toast-container";

const queryClient = new QueryClient();

export const ComposeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthContextProvider>
            <BottomSheetModalProvider>
              {children}

              <CheckUserAgreement />
              <ToastContainer />
            </BottomSheetModalProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
