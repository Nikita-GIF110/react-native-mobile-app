import { DialogFormField } from "./entities";
import { object, string, ObjectSchema, number } from "yup";

export const dialogSchema: ObjectSchema<DialogFormField> = object({
  text: string().max(1000, "Maximum 1000 characters").required(""),
  dialog_id: number().required(),
  product_id: number().required(),
});
