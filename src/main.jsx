import { createRoot } from "react-dom/client";
import "./style/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // ✅ 確保 Bootstrap JS 加載
import { RouterProvider, createHashRouter } from "react-router-dom";
import router from "./router/router";
import { store } from "./store";
import { Provider } from "react-redux";
import { initializeAuth } from './slice/authSlice';
import * as Sentry from "@sentry/react";
import ErrorBoundary from './utils/ErrorBoundary';

//Sentry.captureException(error);
//Sentry.captureMessage('User logged in', Sentry.Severity.Info);

Sentry.init({
  dsn: "https://1bc37ff8c006b46506235447832b7be0@o4509031854702592.ingest.us.sentry.io/4509031856013312",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

store.dispatch(initializeAuth());

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={store}>
      <RouterProvider router={createHashRouter(router)} />
    </Provider>
  </ErrorBoundary>
);
