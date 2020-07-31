import * as React from "react";
import PaneTabNavigation from "./PaneTabNavigation";

type PropsType = {
  right?: boolean;
  left?: boolean;
  //@ts-ignore

  children?: React.Node;
};

const Pane = (props: PropsType) => {
  const paneType = props.left ? "left" : "right";

  return (
    <div className="h-100 d-flex flex-column">
      <PaneTabNavigation paneType={paneType} />
      <div className="flex-grow-1 overflow-auto d-flex flex-column position-relative">
        {props.children}
      </div>
    </div>
  );
};

export default Pane;
