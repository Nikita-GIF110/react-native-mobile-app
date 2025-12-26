import { RecoverPasswordStepper } from "@/src/widgets/recover-password-stepper";
import { Appbar, BackActionButton, SafeAreaView } from "@/src/shared/ui-kit";
import { View } from "react-native";

export const RecoverPassword = () => {
  return (
    <SafeAreaView>
      <Appbar>
        <BackActionButton />
      </Appbar>

      <View style={{ flex: 1 }}>
        <RecoverPasswordStepper />
      </View>
    </SafeAreaView>
  );
};
