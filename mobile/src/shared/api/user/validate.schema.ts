import { object, string, ObjectSchema, array } from "yup";
import type {
  UserChangeNameFormFields,
  UserChangAvatarFormFields,
} from "./entities";

export const changeUserNameSchema: ObjectSchema<UserChangeNameFormFields> =
  object({
    new_name: string()
      .defined("Required field")
      .min(3, "Minimum 3 characters")
      .max(20, "Maximum 20 characters"),
  });

export const changeUserAvatarSchema: ObjectSchema<UserChangAvatarFormFields> =
  object({
    picture: array().required("Required field"),
  });
