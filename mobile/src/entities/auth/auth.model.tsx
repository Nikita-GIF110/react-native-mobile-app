import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { CONFIG, ROUTES } from "@/src/shared/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { auth, RecoverPasswordFormFields } from "@/src/shared/api/auth";
import Toast from "react-native-toast-message";
import { OnSubmitForm } from "@/src/shared/types";
import { useTimer } from "@/src/shared/lib";

type RoutesMap = typeof ROUTES;

interface UserData {
  token: string | null;
  email: string | null;
}

interface AuthContextProps {
  userData: UserData;
  isAuthorized: boolean;
  logOut: () => Promise<void>;
  setUserData: (userData: UserData) => Promise<void>;
  resetUserData: () => Promise<void>;
  redirectToSignIn: <K extends keyof RoutesMap>({
    from,
  }: {
    from?: RoutesMap[K];
  }) => void;
}

const AuthContext = React.createContext<AuthContextProps | null>({
  isAuthorized: false,
  logOut: async () => {},
  redirectToSignIn: () => {},
  userData: { email: null, token: null },
  setUserData: async () => {},
  resetUserData: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [email, setEmail] = React.useState<UserData["email"] | null>(null);
  const [token, setToken] = React.useState<UserData["token"] | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  const resetUserData = async () => {
    try {
      await SecureStore.deleteItemAsync(CONFIG.TOKEN_KEY);
      await SecureStore.deleteItemAsync(CONFIG.EMAIL_KEY);
      queryClient.clear(); // или `invalidateQueries()` — зависит от нужд

      setIsAuthorized(false);
      setEmail(null);
      setToken(null);
    } catch (error) {
      // handelErrorDetail(error);
    }
  };

  const logOut = async () => {
    await resetUserData();
    router.replace("/");
  };

  const setUserData = async (userData: UserData) => {
    await SecureStore.setItemAsync(CONFIG.TOKEN_KEY, userData.token ?? "");
    await SecureStore.setItemAsync(CONFIG.EMAIL_KEY, userData.email ?? "");

    setEmail(userData.email);
    setToken(userData.token);
    setIsAuthorized(!!(userData.email && userData.token));
  };

  const redirectToSignIn: AuthContextProps["redirectToSignIn"] = ({
    from = "/",
  }) => {
    router.push({ pathname: "/(auth)/sign-in", params: { from } });
  };

  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const [tokenFromSecureStore, emailFromSecureStore] = await Promise.all([
          SecureStore.getItemAsync(CONFIG.TOKEN_KEY),
          SecureStore.getItemAsync(CONFIG.EMAIL_KEY),
        ]);

        setUserData({
          token: tokenFromSecureStore,
          email: emailFromSecureStore,
        });

        setIsAuthorized(!!token);
      } catch (error) {
        // handelErrorDetail(error);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthorized,
        redirectToSignIn,
        setUserData,
        logOut,
        userData: { email, token },
        resetUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextProps => {
  const theme = React.useContext(AuthContext);

  if (!theme) {
    throw new Error("use the context inside the provider AuthContextProvider");
  }

  return theme;
};
