import Toast from "react-native-toast-message";
import {
  user,
  UserChangAvatarFormFields,
  UserChangeNameFormFields,
  UserChangeRatingFormFields,
} from "@/src/shared/api/user";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { OnSubmitForm } from "@/src/shared/types";
import { FORM_ERROR } from "final-form";

export const useFetchUserById = (userId: number | undefined) => {
  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      user.getUserById(userId?.toString() as string).catch(() =>
        Toast.show({
          type: "error",
          text1: "Erron during fetch user by id",
        })
      ),
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  return {
    user: query.data?.data,
    isLoaded: query.isFetched,
    error: query.isLoadingError,
  };
};

export const useFetchProfile = (isAuthorized: boolean) => {
  const query = useQuery({
    queryKey: ["my-profile"],
    queryFn: () =>
      user.getUserProfile().catch(() =>
        Toast.show({
          type: "error",
          text1: "Erron during fetch profile",
        })
      ),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    enabled: isAuthorized,
  });

  return {
    user: query.data?.data,
    isLoaded: query.isFetched,
    hasError: query.isLoadingError,
  };
};

export const useReportUser = () => {
  const queryClient = useQueryClient();
  const reportUserMutation = useMutation({ mutationFn: user.reportUser });

  const onReportUser = (id: number) => {
    reportUserMutation.mutate(id, {
      onSuccess: () => {
        Toast.show({
          text1: "The complaint about the user has been sent",
        });
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      },
      onError: () => {
        Toast.show({
          text1: "Error during report user",
          type: "error",
        });
      },
    });
  };

  return { onReportUser, isPending: reportUserMutation.isPending };
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  const blockUserMutation = useMutation({ mutationFn: user.blockUser });

  const onBlockUser = async (id: number) => {
    blockUserMutation.mutateAsync(id, {
      onSuccess: () => {
        Toast.show({
          text1: "The request to block the user has been sent",
        });
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      },
      onError: (error) => {
        Toast.show({
          text1: "Error during block user",
          type: "error",
        });
      },
    });
  };

  return {
    onBlockUser,
    isPending: blockUserMutation.isPending,
  };
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  const unblockUserMutation = useMutation({ mutationFn: user.unblockUser });

  const onUnblockUser = async (id: number) => {
    unblockUserMutation.mutate(id, {
      onSuccess: () => {
        Toast.show({ text1: "Unblocking request sent" });
        queryClient.invalidateQueries({ queryKey: ["user", id] });
      },
      onError: (error) => {
        Toast.show({
          text1: "Error during unblock user",
          type: "error",
        });
      },
    });
  };

  return {
    onUnblockUser,
    isPending: unblockUserMutation.isPending,
  };
};

export const useSetUserRating = (id?: number) => {
  const queryClient = useQueryClient();
  const setUserRatingMutation = useMutation({ mutationFn: user.setUserRating });

  const onSetUserRating: OnSubmitForm<UserChangeRatingFormFields> = async (
    fields,
    form,
    callback = () => {}
  ) => {
    setUserRatingMutation.mutate(fields, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", id] });
        form.restart();
        callback();
      },
      onError: () => {
        Toast.show({
          text1: "Error during rate user",
          type: "error",
        });
        callback({ [FORM_ERROR]: "Error during rate user" });
      },
    });
  };

  return {
    onSetUserRating,
    isPending: setUserRatingMutation.isPending,
  };
};

export const useFetchProfileData = () => {
  const query = useQuery({
    queryKey: ["my-profile"],
    queryFn: () =>
      user.getUserProfile().catch(() =>
        Toast.show({
          text1: "Error during fetch profile",
          type: "error",
        })
      ),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 минут
  });

  return {
    user: query.data?.data,
    isLoaded: query.isFetched,
    hasError: query.isLoadingError,
  };
};

export const useChangeUserName = () => {
  const queryClient = useQueryClient();

  const changeUserNameMutation = useMutation({
    mutationFn: user.changeUserName,
  });

  const onChangeUserName: OnSubmitForm<UserChangeNameFormFields> = async (
    fields,
    form,
    callback = () => {}
  ) => {
    changeUserNameMutation.mutate(fields, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "The complaint about the user has been sent",
        });
        queryClient.resetQueries({ queryKey: ["my-profile"] });
        form.restart();
        callback();
      },
      onError: (error) => {
        Toast.show({
          text1: "Error during fetch profile",
          type: "error",
        });
        callback({ [FORM_ERROR]: "Error when changing the avatar" });
      },
    });
  };

  return {
    onChangeUserName,
    isPending: changeUserNameMutation.isPending,
  };
};

export const useChangeUserAvatar = () => {
  const queryClient = useQueryClient();

  const changeUserAvatarMutation = useMutation({
    mutationFn: user.changeUserAvatar,
  });

  const onChangeUserAvatar: OnSubmitForm<UserChangAvatarFormFields> = async (
    { picture },
    form,
    callback = () => {}
  ) => {
    const formData = new FormData();
    picture.forEach((image) => formData.append("picture", image));

    changeUserAvatarMutation.mutate(formData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "The avatar has been successfully changed",
        });
        queryClient.resetQueries({ queryKey: ["my-profile"] });
        form.restart();
        callback();
      },
      onError: (error) => {
        Toast.show({
          text1: "Error during change profile avatar",
          type: "error",
        });
        callback({ [FORM_ERROR]: "Error when changing the avatar" });
      },
    });
  };

  return {
    onChangeUserAvatar,
    isPending: changeUserAvatarMutation.isPending,
  };
};

