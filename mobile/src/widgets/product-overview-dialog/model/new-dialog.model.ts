import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DialogFormField,
  DialogOverviewEntity,
} from "@/src/shared/api/dialogs";
import { dialogs } from "@/src/shared/api/dialogs";
import { OnSubmitForm } from "@/src/shared/types";
import { FORM_ERROR } from "final-form";

export const useStartNewDialog = () => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = React.useState<
    DialogOverviewEntity["messages"]
  >([]);

  const startDialogMutation = useMutation({
    mutationFn: dialogs.startDialog,
  });

  const onSendMessage: OnSubmitForm<DialogFormField> = async (
    { text, product_id },
    _form,
    callback = () => {}
  ) => {
    startDialogMutation.mutate(
      { text, product_id },
      {
        onError: (error) => {
          callback({ [FORM_ERROR]: "Error" });
        },
        onSuccess: ({ data }) => {
          const productId = product_id.toString();

          setMessages((prevState) => [
            ...prevState,
            {
              creationTime: data.dialog.creationTime,
              dialog_id: data.dialog.id,
              hasSeen: false,
              id: data.dialog.id,
              isSelf: true,
              text: data.message,
              user_id: -1,
              message_client_uid: "string",
            },
          ]);
          queryClient.invalidateQueries({ queryKey: ["chats"] });
          queryClient.invalidateQueries({
            queryKey: ["product-overview", productId],
          });
          callback();
        },
      }
    );
  };

  return {
    messages,
    onSendMessage,
  };
};
