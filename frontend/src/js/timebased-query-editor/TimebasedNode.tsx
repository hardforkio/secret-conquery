import React from "react";
import { findDOMNode } from "react-dom";
import T from "i18n-react";
import styled from "@emotion/styled";
import { DragSource } from "react-dnd";

import VerticalToggleButton, {
  Option
} from "../form-components/VerticalToggleButton";
import {
  EARLIEST,
  LATEST,
  RANDOM
} from "../common/constants/timebasedQueryTimestampTypes";
import { TIMEBASED_NODE } from "../common/constants/dndTypes";

import IconButton from "../button/IconButton";

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const Root = styled("div")`
  margin: 0 5px;
  width: 200px;
  font-size: ${({ theme }) => theme.font.sm};
`;

const StyledVerticalToggleButton = styled(VerticalToggleButton)`
  ${Option} {
    border: 0;

    &:first-of-type,
    &:last-of-type {
      border-radius: 0;
    }
  }
`;

type PropsType = {
  node: Record<string, any>;
  position: "left" | "right";
  isIndexResult: boolean;
  onRemove: Function;
  onSetTimebasedNodeTimestamp: Function;
  onSetTimebasedIndexResult: Function;
  conditionIdx: number;
  resultIdx: number;
  connectDragSource: Function;
  isIndexResultDisabled: boolean;
};

// Has to be a class because of https://github.com/react-dnd/react-dnd/issues/530
class TimebasedNode extends React.Component {
  //@ts-ignore
  props: PropsType;

  render() {
    const {
      node,
      connectDragSource,
      // isIndexResult,
      // isIndexResultDisabled,
      onRemove,
      // onSetTimebasedIndexResult,
      onSetTimebasedNodeTimestamp
    } = this.props;

    const toggleButton = (
      <StyledVerticalToggleButton
        //@ts-ignore
        onToggle={onSetTimebasedNodeTimestamp}
        //@ts-ignore
        activeValue={node.timestamp}
        options={[
          {
            //@ts-ignore
            label: T.translate("timebasedQueryEditor.timestampFirst"),
            value: EARLIEST
          },
          {
            //@ts-ignore
            label: T.translate("timebasedQueryEditor.timestampRandom"),
            value: RANDOM
          },
          {
            //@ts-ignore
            label: T.translate("timebasedQueryEditor.timestampLast"),
            value: LATEST
          }
        ]}
      />
    );

    return (
      <Root
        ref={instance => {
          connectDragSource(instance);
        }}
      >
        <div className="timebased-node__container">
          <div className="timebased-node__content">
            <div className="timebased-node__timestamp">
              <p className="timebased-node__timestamp__title">
                {T.translate("timebasedQueryEditor.timestamp")}
              </p>
              {toggleButton}
            </div>
            <div className="timebased-node__description">
              <StyledIconButton
                icon="times"
                //@ts-ignore
                onClick={onRemove}
              />
              <p className="timebased-node__description__text">
                {
                  //@ts-ignore
                  node.label || node.id
                }
              </p>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}

// Button indexResult (to re-enable this soon)
// <button
//   className={classnames("timebased-node__index-result-btn", {
//     "timebased-node__index-result-btn--active": isIndexResult,
//     "timebased-node__index-result-btn--disabled": isIndexResultDisabled
//   })}
//   disabled={isIndexResultDisabled}
//   onClick={onSetTimebasedIndexResult}
// >
//   {T.translate("timebasedQueryEditor.timestampResultsFrom")}
// </button>

/**
 * Implements the drag source contract.
 */
const nodeSource = {
  //@ts-ignore
  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    const { node, conditionIdx, resultIdx } = props;
    //@ts-ignore
    const { width, height } = findDOMNode(component).getBoundingClientRect();

    return {
      width,
      height,
      conditionIdx,
      resultIdx,
      node,
      moved: true
    };
  }
};

/**
 * Specifies the dnd-related props to inject into the component.
 */
//@ts-ignore
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const DraggableTimebasedNode = DragSource(
  TIMEBASED_NODE,
  nodeSource,
  collect
)(TimebasedNode);

export default DraggableTimebasedNode;
