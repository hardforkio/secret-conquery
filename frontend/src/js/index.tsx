import "./browserShimsAndPolyfills";

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, Theme } from "@emotion/react";
import { createBrowserHistory } from "history";

import "./app/actions"; //  To initialize parameterized actions
import { makeStore } from "./store";
import AppRoot from "./AppRoot";

import { initializeEnvironment, Environment, basename } from "./environment";

// TODO: OG image required?
// require('../../images/og.png');
// Required for isomophic-fetch

//@ts-ignore

let store;
//@ts-ignore

let browserHistory;
const initialState = {};

// Render the App including Hot Module Replacement
const renderRoot = (tabs: Record<string, any>, theme: Theme) => {
  browserHistory =
    //@ts-ignore

    browserHistory ||
    createBrowserHistory({
      basename: basename()
    });
  //@ts-ignore

  store = store || makeStore(initialState, browserHistory, tabs);

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <AppRoot
        store={store}
        browserHistory={browserHistory}
        //@ts-ignore
        rightTabs={tabs}
      />
    </ThemeProvider>,
    document.getElementById("root")
  );
};

export default function conquery(
  environment: Environment,
  tabs: Record<string, any>,
  theme: Theme // React-Emotion theme, will at some point completely replace sass
) {
  initializeEnvironment(environment);
  renderRoot(tabs, theme);
}
