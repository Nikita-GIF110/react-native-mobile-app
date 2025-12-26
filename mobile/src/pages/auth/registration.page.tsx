import { RegistrationStepper } from "@/src/widgets/registration-stepper";
import { Appbar, BackActionButton, SafeAreaView } from "@/src/shared/ui-kit";
import { View } from "react-native";

export const Registration = () => {
  return (
    <SafeAreaView>
      <Appbar>
        <BackActionButton />
      </Appbar>

      <View style={{ flex: 1 }}>
        <RegistrationStepper />
      </View>
    </SafeAreaView>
  );
};
