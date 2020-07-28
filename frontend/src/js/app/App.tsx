import React, { FunctionComponent } from "react";

import { useStartup } from "../startup/useStartup";
import Header from "../header/Header";
import SnackMessage from "../snack-message/SnackMessage";
import Content from "./Content";

const App: FunctionComponent<any> = props => {
  useStartup();

  return <>{[<Header />, <Content {...props} />, <SnackMessage />]}</>;
};

export default App;
