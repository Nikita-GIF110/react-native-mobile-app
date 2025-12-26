import { AxiosRequestConfig } from "axios";
import { instance } from "../instance";
import type {
  DialogEntity,
  CreateDialogFormField,
  DialogOverviewEntity,
  DialogFormField,
  DialogFiltesFormField,
} from "./entities";

export const dialogs = {
  startDialog: async (dialogData: CreateDialogFormField) => {
    return instance().post<{
      dialog: {
        creationTime: string;
        customer_id: number;
        id: number;
        product_id: number;
        seller_id: number;
      };
      message: string;
    }>("/create-dialog/", dialogData);
  },
  getDialogList: async (
    params?: Partial<DialogFiltesFormField>,
    config?: AxiosRequestConfig<DialogEntity>
  ) => {
    return instance().get<DialogEntity[]>("/dialogs/", {
      ...config,
      params,
    });
  },
  getDialogById: async (dialogId: string) => {
    return instance().get<DialogOverviewEntity>(`/dialogs/${dialogId}`);
  },
  sendMessage: async (dialogData: DialogFormField) => {
    return instance().post<DialogOverviewEntity>("/send-message/", dialogData);
  },
  getProductPreDialog: async (product_id: string) => {
    return instance().get<{
      dialog_info: {
        user_is_blocked: boolean;
        dialog_id: number;
        product_id: number;
      };
    }>("/pre-dialog/", {
      params: { product_id },
    });
  },
};
