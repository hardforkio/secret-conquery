import React from "react";
import styled from "@emotion/styled";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, {
  TouchTransition,
  Preview,
  usePreview
} from "react-dnd-multi-backend";
import { RouteComponentProps, withRouter } from "react-router";

import Tooltip from "../tooltip/Tooltip";

import type { TabT } from "../pane/types";
import LeftPane from "./LeftPane";
import RightPane from "./RightPane";
import { ContentLayout } from "../ContentLayout";
import { BackendFactory } from "dnd-core";
import Header from "../header/Header";

interface PreviewItemProps {
  theme?: any;
  width: string;
  height: string;
}

const PreviewItem = styled("div")`
  background-color: ${({ theme }: PreviewItemProps) => theme.col.grayVeryLight};
  opacity: 0.9;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.col.gray};
  width: ${//@ts-ignore
  ({ width }) => `${width}px`};
  height: ${//@ts-ignore
  ({ height }) => `${height}px`};
`;

// The mobile drag preview doesn't seem to be working at the moment
// Consider upgrading react-dnd BUT somehow try to keep IE11 compatibility
//@ts-ignore

const DragPreview = () => {
  const { item, style, display } = usePreview();
  if (!display) {
    return null;
  }
  return (
    <PreviewItem width={item.width} height={item.height} style={style}>
      {item.label}
    </PreviewItem>
  );
};

interface ContentProps extends RouteComponentProps {
  rightTabs: TabT[];
}

export const CustomHTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend
    },
    {
      backend: TouchBackend,
      transition: TouchTransition,
      options: {
        delayTouchStart: 100, //This enables touch to scroll and touch and hold to drag.
        ignoreContextMenu: true
      },
      preview: true
    }
  ]
};

const Content: React.FC<ContentProps> = ({ rightTabs }) => {
  return (
    <DndProvider
      backend={(MultiBackend as unknown) as BackendFactory}
      options={CustomHTML5toTouch}
    >
      <ContentLayout
        menu={<Header />}
        info={<Tooltip />}
        editor={<RightPane tabs={rightTabs} />}
        tools={<LeftPane />}
      />

      <Preview>
        <DragPreview />
      </Preview>
    </DndProvider>
  );
};

export default withRouter(Content);
