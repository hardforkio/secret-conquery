import * as React from "react";
import PaneTabNavigation from "./PaneTabNavigation";

type PropsType = {
  right?: boolean;
  left?: boolean;
};

const Pane: React.FC<PropsType> = props => {
  const paneType = props.left ? "left" : "right";

  return (
    <div className="h-100 d-flex flex-column">
      <PaneTabNavigation paneType={paneType} />
      <div className="flex-grow-1">{props.children}</div>
    </div>
  );
};

export default Pane;
