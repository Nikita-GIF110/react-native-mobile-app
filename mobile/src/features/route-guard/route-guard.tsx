import { useAuthContext } from "@/src/entities/auth";
import React from "react";
import { Redirect } from "expo-router";
import { ROUTES } from "@/src/shared/config";

type RoutesMap = typeof ROUTES;

export const RouteGuard = <K extends keyof RoutesMap>({
  children,
  routeName,
}: {
  children: React.ReactNode;
  routeName: RoutesMap[K];
}) => {
  const { isAuthorized, resetUserData } = useAuthContext();

  if (!isAuthorized) {
    resetUserData();
    return (
      <Redirect
        href={{
          pathname: ROUTES.SIGN_IN,
          params: { from: routeName },
        }}
      />
    );
  }

  return children;
};
