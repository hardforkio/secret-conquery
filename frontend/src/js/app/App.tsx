import React, { FunctionComponent } from "react";

import { useStartup } from "../startup/useStartup";
import SnackMessage from "../snack-message/SnackMessage";
import Content from "./Content";

const App: FunctionComponent<any> = props => {
  useStartup();

  return (
    <div className="position-relative">
      {[<Content {...props} />, <SnackMessage />]}
    </div>
  );
};

export default App;
