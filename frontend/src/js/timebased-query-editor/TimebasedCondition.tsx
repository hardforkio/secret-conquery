import React from "react";
import T from "i18n-react";
import styled from "@emotion/styled";

import {
  BEFORE,
  BEFORE_OR_SAME,
  DAYS_BEFORE,
  SAME,
  DAYS_OR_NO_EVENT_BEFORE
} from "../common/constants/timebasedQueryOperatorTypes";
import { isEmpty } from "../common/helpers";

import IconButton from "../button/IconButton";

import VerticalToggleButton from "../form-components/VerticalToggleButton";

import TimebasedQueryEditorDropzone from "./TimebasedQueryEditorDropzone";
import TimebasedConditionDayRange from "./TimebasedConditionDayRange";
import TimebasedNode from "./TimebasedNode";

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: inline;
`;

const Root = styled("div")`
  position: relative;
  padding: 30px 10px 10px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.col.grayLight};
  background-color: ${({ theme }) => theme.col.graySuperLight};

  &:hover {
    border: 1px solid ${({ theme }) => theme.col.grayLight};
  }
`;

const StyledVerticalToggleButton = styled(VerticalToggleButton)`
  max-width: 180px;
`;

const NodesContainer = styled("div")`
  margin-bottom: 10px;
  position: relative;
`;

const Nodes = styled("div")`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HorizontalLine = styled("div")`
  position: absolute;
  top: 50%;
  right: 10%;
  width: 80%;
  border-bottom: 1px solid ${({ theme }) => theme.col.blueGray};
  margin-top: -0.5px;
`;

const Operator = styled("div")`
  margin: 0 10px;
`;

type PropsType = {
  condition: Record<string, any>;
  conditionIdx: number;
  indexResult: number | string | null;
  removable: boolean;
  onRemove: Function;
  onSetOperator: Function;
  onDropTimebasedNode: Function;
  onSetTimebasedNodeTimestamp: Function;
  onRemoveTimebasedNode: Function;
  onSetTimebasedIndexResult: Function;
  onSetTimebasedConditionMinDays: Function;
  onSetTimebasedConditionMaxDays: Function;
  onSetTimebasedConditionMinDaysOrNoEvent: Function;
  onSetTimebasedConditionMaxDaysOrNoEvent: Function;
};

const TimebasedCondition = (props: PropsType) => {
  //@ts-ignore
  const minDays = !isEmpty(props.condition.minDays)
    ? //@ts-ignore
      props.condition.minDays
    : "";
  //@ts-ignore
  const maxDays = !isEmpty(props.condition.maxDays)
    ? //@ts-ignore
      props.condition.maxDays
    : "";
  //@ts-ignore
  const minDaysOrNoEvent = !isEmpty(props.condition.minDaysOrNoEvent)
    ? //@ts-ignore
      props.condition.minDaysOrNoEvent
    : "";

  //@ts-ignore
  const createTimebasedResult = idx => {
    //@ts-ignore
    return props.condition[`result${idx}`] ? (
      <TimebasedNode
        //@ts-ignore
        node={props.condition[`result${idx}`]}
        conditionIdx={props.conditionIdx}
        resultIdx={idx}
        //@ts-ignore
        isIndexResult={props.condition[`result${idx}`].id === props.indexResult}
        position={idx === 0 ? "left" : "right"}
        onRemove={() => props.onRemoveTimebasedNode(idx, false)}
        //@ts-ignore
        onSetTimebasedNodeTimestamp={timestamp => {
          props.onSetTimebasedNodeTimestamp(idx, timestamp);
        }}
        onSetTimebasedIndexResult={() => {
          //@ts-ignore
          props.onSetTimebasedIndexResult(props.condition[`result${idx}`].id);
        }}
        isIndexResultDisabled={
          //@ts-ignore
          idx === 0 && props.condition.operator === DAYS_OR_NO_EVENT_BEFORE
        }
      />
    ) : (
      <TimebasedQueryEditorDropzone
        //@ts-ignore
        onDropNode={(node, moved) =>
          props.onDropTimebasedNode(idx, node, moved)
        }
      />
    );
  };

  const result0 = createTimebasedResult(0);
  const result1 = createTimebasedResult(1);

  return (
    <Root>
      {props.removable && (
        //@ts-ignore
        <StyledIconButton icon="times" onClick={props.onRemove} />
      )}
      <NodesContainer>
        <HorizontalLine />
        <Nodes>
          {result0}
          <Operator>
            <StyledVerticalToggleButton
              //@ts-ignore
              onToggle={props.onSetOperator}
              //@ts-ignore
              activeValue={props.condition.operator}
              options={[
                {
                  //@ts-ignore
                  label: T.translate("timebasedQueryEditor.opBefore"),
                  value: BEFORE
                },
                {
                  //@ts-ignore
                  label: T.translate("timebasedQueryEditor.opBeforeOrSame"),
                  value: BEFORE_OR_SAME
                },
                {
                  //@ts-ignore
                  label: T.translate("timebasedQueryEditor.opDays"),
                  value: DAYS_BEFORE
                },
                {
                  //@ts-ignore
                  label: T.translate("timebasedQueryEditor.opSame"),
                  value: SAME
                },
                {
                  //@ts-ignore
                  label: T.translate(
                    "timebasedQueryEditor.opDaysOrNoEventBefore"
                  ),
                  value: DAYS_OR_NO_EVENT_BEFORE
                }
              ]}
            />
          </Operator>
          {result1}
        </Nodes>
      </NodesContainer>
      {
        //@ts-ignore
        props.condition.operator === DAYS_BEFORE && (
          <TimebasedConditionDayRange
            minDays={minDays}
            maxDays={maxDays}
            onSetTimebasedConditionMinDays={
              props.onSetTimebasedConditionMinDays
            }
            onSetTimebasedConditionMaxDays={
              props.onSetTimebasedConditionMaxDays
            }
          />
        )
      }
      {
        //@ts-ignore
        props.condition.operator === DAYS_OR_NO_EVENT_BEFORE && (
          //@ts-ignore
          <TimebasedConditionDayRange
            minDays={minDaysOrNoEvent}
            onSetTimebasedConditionMinDays={
              props.onSetTimebasedConditionMinDaysOrNoEvent
            }
          />
        )
      }
    </Root>
  );
};

export default TimebasedCondition;
