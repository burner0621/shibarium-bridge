import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store } from "state";
import { GlobalStyles } from "components";
import ErrorProvider from "context/ErrorContext";

import App from "./App";
import "./onboard-override.css";
import "./index.css";

const instance = createInstance({
  urlBase: "https://across.matomo.cloud",
  siteId: 1,
  linkTracking: true,
  trackerUrl: "https://across.matomo.cloud/matomo.php",
});

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <Provider store={store}>
      <ErrorProvider>
        <MatomoProvider value={instance}>
          <App />
        </MatomoProvider>
      </ErrorProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
