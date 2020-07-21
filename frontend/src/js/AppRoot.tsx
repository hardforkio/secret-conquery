import React from "react";
import { Provider } from "react-redux";
import { hot } from "react-hot-loader";

import type { TabT } from "./pane/types";

import AppRouter from "./app/AppRouter";

type PropsType = {
  store: Record<string, any>;
  browserHistory: Record<string, any>;
  rightTabs: TabT[];
};

const AppRoot = ({ store, browserHistory, rightTabs }: PropsType) => (
  //@ts-ignore

  <Provider store={store}>
    <AppRouter history={browserHistory} rightTabs={rightTabs} />
  </Provider>
);

export default hot(module)(AppRoot);
