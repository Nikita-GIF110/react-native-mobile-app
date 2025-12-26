import React from "react";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";
const projectId =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const registerForPushNotificationsAsync = async () => {
  if (!isIOS || isAndroid) {
    Alert.alert(
      "Внимание",
      "Push-уведомления не поддерживаются на этом устройстве."
    );
    return;
  }

  if (!Device.isDevice) {
    Alert.alert(
      "Внимание",
      "Push-уведомления не поддерживаются на этом устройстве."
    );
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (isAndroid) {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return token;
};

export const usePushNotification = () => {
  React.useEffect(() => {
    registerForPushNotificationsAsync();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // console.log("Получено уведомление:", notification);
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);
};
