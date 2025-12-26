import { Text, Icon } from "react-native-paper";
import { formatTime } from "@/src/shared/lib/date-formatter";
import { useAppTheme } from "../models/theme.model";

interface MessageProps {
  text: string;
  creationTime: string;
  messageStatus?: number;
}

const deliveryMessageStatusIcon: Record<
  number,
  React.ComponentProps<typeof Icon>["source"]
> = {
  0: "close", // Not received
  1: "check", // Delivered
  2: "check-all", // Read it
};

export const MessageStatus = ({
  messageStatus,
}: {
  messageStatus?: number;
}) => {
  const { colors } = useAppTheme();

  if (typeof messageStatus !== "number") {
    return null;
  }

  const deliveryMessageStatusColor: Record<number, string> = {
    0: colors.error, // Not received
    1: "rgba(41, 40, 72, 0.4)", // Delivered
    2: "#6181FF", // Read it
  };

  return (
    <Icon
      source={deliveryMessageStatusIcon[messageStatus]}
      size={16}
      color={deliveryMessageStatusColor[messageStatus]}
    />
  );
};
export const MessageSendingTime = ({
  creationTime,
}: {
  creationTime: MessageProps["creationTime"];
}) => {
  const { colors } = useAppTheme();
  return (
    <Text
      style={{ color: colors.onBackground, opacity: 0.8 }}
      variant="labelSmall"
    >
      {formatTime(creationTime)}
    </Text>
  );
};
