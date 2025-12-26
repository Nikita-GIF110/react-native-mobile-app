export interface DialogEntity {
  dialog_id: number;
  last_message: string;
  last_message_date: string;
  last_message_is_seen: boolean;
  last_message_is_self: boolean;
  product_id: number;
  product_is_self: boolean;
  product_name: string;
  product_preview_image: string;
  product_price: number;
  user_id: number;
  user_image: string;
  user_is_blocked: boolean;
  user_name: string;
  product_currency: string;
  is_blocked: boolean;
}

export interface DialogOverviewEntity {
  dialog_info: {
    dialog_id: number;
    product_id: number;
    product_is_self: boolean;
    product_name: string;
    product_preview_image: string;
    product_price: number;
    user_id: number;
    user_image: string;
    user_is_blocked: boolean;
    is_blocked: boolean;
    user_name: string;
    product_currency: string;
  };
  messages: {
    creationTime: string;
    dialog_id: number;
    hasSeen: boolean;
    id: number;
    isSelf: boolean;
    text: string;
    user_id: number;
    message_client_uid?: string;
  }[];
}

export interface CreateDialogFormField {
  text: string;
  product_id: number;
}

export interface DialogFormField {
  text: string;
  dialog_id: number;
  product_id: number;
}

export interface DialogFiltesFormField {
  page: number;
}
