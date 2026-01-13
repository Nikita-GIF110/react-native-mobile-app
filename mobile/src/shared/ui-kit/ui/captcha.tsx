import React from "react";
import { useField } from "react-final-form";
import { WebViewMessageEvent } from "react-native-webview";
import ConfirmHcaptcha from "@hcaptcha/react-native-hcaptcha";

export const CaptchaFormField = React.forwardRef<
  ConfirmHcaptcha,
  { name: string }
>(function Captcha({ name }, ref) {
  const { input } = useField(name);
  const captchaRef = ref;

  const handelMessage = (event: WebViewMessageEvent) => {
    input.onFocus();
    // https://github.com/hCaptcha/react-native-hcaptcha/blob/9deccb75ccf012a22cde29b78721b1e28fa02979/Example.App.js
    if (event && event.nativeEvent.data) {
      if (["cancel"].includes(event.nativeEvent.data)) {
        captchaRef.current?.hide();
      } else if (["error"].includes(event.nativeEvent.data)) {
        captchaRef.current?.hide();
      } else if (event.nativeEvent.data === "expired") {
      } else if (event.nativeEvent.data === "open") {
      } else {
        captchaRef.current?.hide();
        input.onChange(event.nativeEvent.data);
        // onMessage(event.nativeEvent.data);
      }
    }
    input.onBlur();
  };

  return (
    <ConfirmHcaptcha
      ref={ref}
      siteKey="my-key"
      languageCode="ru"
      onMessage={handelMessage}
      showLoading
      size="invisible"
      sentry
      loadingIndicatorColor="white"
      baseUrl="https://hcaptcha.com"
    />
  );
});
