import { useAuthContext } from "@/src/entities/auth";
import type { OnSubmitForm } from "@/src/shared/types";
import type {
  DialogEntity,
  DialogFormField,
  DialogOverviewEntity,
} from "@/src/shared/api/dialogs";
import useWebSocket from "react-use-websocket";
import { uniqueId } from "@/src/shared/lib";
import { CONFIG } from "@/src/shared/config";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Toast from "react-native-toast-message";

type Message = DialogOverviewEntity["messages"][0];

export const useChatWebSocket = (chatId: string) => {
  const queryClient = useQueryClient();
  const { userData } = useAuthContext();
  const socketUrl = `${CONFIG.WEB_SOCKET_BASE_URL}/?token=${userData.token}&dialog_id=${chatId}`;

  const { sendMessage } = useWebSocket<Message>(socketUrl, {
    shouldReconnect: () => true,
    onMessage: ({ data }) => {
      const parsedMessage: Message = JSON.parse(data);

      queryClient.setQueryData<AxiosResponse<DialogOverviewEntity>>(
        ["chat-overview", chatId],
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            ...oldData,
            data: {
              ...oldData.data,
              messages: [parsedMessage, ...oldData.data.messages],
            },
          };
        }
      );

      queryClient.setQueryData<InfiniteData<AxiosResponse<DialogEntity[]>>>(
        ["chats"],
        (oldData) => {
          if (!oldData) {
            return;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((item) => {
                if (item.dialog_id !== parsedMessage.dialog_id) {
                  return item;
                }
                return {
                  ...item,
                  last_message: parsedMessage.text,
                  last_message_is_self: true,
                };
              }),
            })),
          };
        }
      );
    },
    onError: (event) => {
      Toast.show({ text1: "Something went wrong.", type: "error" });
    },
  });

  const onSubmit: OnSubmitForm<DialogFormField> = async (fields, from) => {
    from.restart();
    sendMessage(
      JSON.stringify({
        dialog_id: fields.dialog_id,
        text: fields.text.trim(),
        message_client_uid: uniqueId(),
      })
    );
  };

  return {
    onSubmit,
  };
};
