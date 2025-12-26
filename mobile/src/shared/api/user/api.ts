import { instance } from "../instance";
import type {
  UserChangeNameFormFields,
  UserEntity,
  UserChangeRatingFormFields,
  UserEulaEntity,
} from "./entities";

export const user = {
  changeUserName: async (fields: UserChangeNameFormFields) => {
    return instance().post<void>("/user-set-name/", fields);
  },
  changeUserAvatar: async (fields: FormData) => {
    return instance().post<void>("/user-set-picture/", fields, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  setUserRating: async (fields: UserChangeRatingFormFields) => {
    return instance().post<void>("/user-set-rate/", fields);
  },

  getUserProfile: async () => {
    return instance().get<UserEntity>("/self-profile/");
  },
  getUserById: async (userId: string) => {
    return instance().get<UserEntity>(`/user-profile/${userId}`);
  },

  reportUser: async (user_id: number) => {
    return instance().post<void>("/user-report/", {
      user_id,
    });
  },
  blockUser: async (user_id: number) => {
    return instance().post<void>("/user-block/", {
      user_id,
    });
  },
  unblockUser: async (user_id: number) => {
    return instance().post<void>("/user-unblock/", {
      user_id,
    });
  },

  getLeatestEula: async () => {
    return instance().get<UserEulaEntity[]>("/get-leatest-eula/");
  },
  checkUserAgreement: async () => {
    return instance().get<boolean>("/check-user-agreement/");
  },
  getAppInfo: async () => {
    return instance().get<{
      app_version: string;
      eula_version: number;
    }>("/app-info/");
  },
  setUserEula: async () => {
    return instance().post("/set_user_eula/");
  },
};
