import * as Sentry from "@sentry/react";

//定義函式，將錯誤訊息傳送到 Sentry 
export const logError = (message, error = null) => {
  if (error) {
    Sentry.captureException(error, {
      extra: { message },
    });
  } else {
    Sentry.captureMessage(message);
  }
};
