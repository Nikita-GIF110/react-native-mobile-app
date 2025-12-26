import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { user } from "@/src/shared/api";
import { Alert } from "react-native";
import { useAuthContext } from "@/src/entities/auth";

export const useFetchEula = () => {
  const query = useQuery({
    queryKey: ["leatest-eula"],
    queryFn: user.getLeatestEula,
    staleTime: Infinity,
  });
  const eulaList = query.data?.data ?? [];

  return {
    eulaList,
    isLoading: query.isLoading,
  };
};

export const useCheckUserAgreement = () => {
  const { isAuthorized } = useAuthContext();
  const [hasNewEula, setHasNewEula] = React.useState(false);

  React.useEffect(() => {
    const checkUserAgreement = async () => {
      if (!isAuthorized) {
        return;
      }

      try {
        const { data: isNeedShowNewEula } = await user.checkUserAgreement();
        setHasNewEula(isNeedShowNewEula);
      } catch (error) {}
    };
    checkUserAgreement();
  }, [isAuthorized]);

  return {
    hasNewEula,
  };
};

export const useAcceptNewEula = () => {
  const acceptNewEulaMutation = useMutation({ mutationFn: user.setUserEula });
  return acceptNewEulaMutation;
};
