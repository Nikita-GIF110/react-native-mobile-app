import {
  MessageSendingTime,
  MessageStatus,
  useAppTheme,
} from "@/src/shared/ui-kit";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  message: {
    padding: 12,
    maxWidth: "80%",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

const UserMessage = ({
  text,
  messageStatus,
  creationTime,
}: {
  text: string;
  creationTime: string;
  messageStatus?: number;
}) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <View style={styles.messageContainer}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        <MessageSendingTime creationTime={creationTime} />
        <MessageStatus messageStatus={messageStatus} />
      </View>

      <View
        style={[
          styles.message,
          { backgroundColor: "#DAD9FF", borderRadius: borderRadius.secondary },
        ]}
      >
        <Text style={{ marginRight: "auto", color: colors.primary }}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const IncomingMessage = ({
  text,
  creationTime,
}: {
  text: string;
  creationTime: string;
}) => {
  const { colors, borderRadius } = useAppTheme();

  return (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.message,
          {
            backgroundColor: colors.surface,
            borderRadius: borderRadius.secondary,
          },
        ]}
      >
        <Text style={{ marginRight: "auto", color: colors.onSurface }}>
          {text}
        </Text>
      </View>

      <MessageSendingTime creationTime={creationTime} />
    </View>
  );
};

export const ChatMessage = ({
  isSelf,
  text,
  messageStatus,
  creationTime,
}: {
  text: string;
  creationTime: string;
  messageStatus?: number;
  isSelf: boolean;
}) => {
  if (isSelf) {
    return (
      <UserMessage
        text={text}
        messageStatus={messageStatus}
        creationTime={creationTime}
      />
    );
  }

  return <IncomingMessage text={text} creationTime={creationTime} />;
};
