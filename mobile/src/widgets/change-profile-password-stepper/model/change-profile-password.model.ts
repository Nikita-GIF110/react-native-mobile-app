import { auth } from "@/src/shared/api/auth";
import type { RecoverPasswordFormFields } from "@/src/shared/api/auth";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useRequestChangePassword = () => {
  const requestChangeMutation = useMutation({
    mutationFn: auth.requestChangePassword,
    onSuccess: (res) => {
      Toast.show({ type: "success", text1: res.data.detail });
    },
  });

  const onSendRequestChangePassword = async (
    email: RecoverPasswordFormFields["email"]
  ) => {
    try {
      await requestChangeMutation.mutateAsync({ email });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during request to change password",
      });
    }
  };

  return {
    onSendRequestChangePassword,
    isPending: requestChangeMutation.isPending,
    data: requestChangeMutation.data?.data,
  };
};

export const useSendNewPassword = () => {
  const changeUserPasswordMutation = useMutation({
    mutationFn: auth.resetUserPassword,
  });

  const onSendNewPassword = async (fields: RecoverPasswordFormFields) => {
    try {
      await changeUserPasswordMutation.mutateAsync({
        code: fields.code,
        email: fields.email,
        password: fields.password,
      });
      Toast.show({
        type: "success",
        text1: "Password was ganged",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error during reset password",
      });
    }
  };

  return {
    onSendNewPassword,
    isPending: changeUserPasswordMutation.isPending,
  };
};

// export const useChangeUserPassword = () => {
//   const [isCanChangePassword, setIsCanChangePassword] = React.useState(false);
//   const { userData } = useAuthContext();
//   const timer = useTimer(899, () => setIsCanChangePassword(false)); // 899 -> 14:59 min

//   const requestChangeMutation = useMutation({
//     mutationFn: auth.requestChangePassword,
//     onSuccess: () => {
//       setIsCanChangePassword(true);
//       timer.startTimer();
//     },
//     onError: (error) => {
//       handelErrorDetail(error);
//       setIsCanChangePassword(false);
//     },
//   });
//   const onRequest = async () => {
//     const { email } = userData;

//     if (!email) {
//       return;
//     }
//     requestChangeMutation.mutate({ email });
//   };

//   const changeUserPasswordMutation = useMutation({
//     mutationFn: auth.resetUserPassword,
//   });
//   const onChangeUserPassword: OnSubmitForm<RecoverPasswordFormFields> = async (
//     { password, code, email },
//     form,
//     callback = () => {}
//   ) => {
//     if (!email) {
//       return;
//     }
//     changeUserPasswordMutation.mutate(
//       { code, email, password },
//       {
//         onSuccess: () => {
//           Toast.show({
//             type: "success",
//             text1: "Password changed successfully",
//           });
//           form.restart();
//           callback();
//         },
//         onError: (error) => {
//           callback({ [FORM_ERROR]: "Error when changing the password" });
//           handelErrorDetail(error);
//         },
//       }
//     );
//   };

//   return {
//     onChangeUserPassword,
//     onSendPasswordChangeRequest: onRequest,
//     isCanChangePassword,
//     timer,
//   };
// };
