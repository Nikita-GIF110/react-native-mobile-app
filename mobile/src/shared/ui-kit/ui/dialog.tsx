import React from "react";
import { Button, Dialog as PaperDialog, Text } from "react-native-paper";

export const Dialog = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  return (
    <PaperDialog visible={visible} onDismiss={onClose}>
      <PaperDialog.Title>Alert</PaperDialog.Title>
      <PaperDialog.Content>
        <Text variant="bodyMedium">This is simple dialog</Text>
      </PaperDialog.Content>
      <PaperDialog.Actions>
        <Button onPress={onClose}>Done</Button>
      </PaperDialog.Actions>
    </PaperDialog>
  );
};
