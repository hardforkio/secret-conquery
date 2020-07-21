import React from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import T from "i18n-react";

import IconButton from "../button/IconButton";

import {
  addTimebasedCondition,
  removeTimebasedCondition,
  setTimebasedConditionOperator,
  dropTimebasedNode,
  setTimebasedNodeTimestamp,
  removeTimebasedNode,
  setTimebasedIndexResult,
  setTimebasedConditionMinDays,
  setTimebasedConditionMaxDays,
  setTimebasedConditionMinDaysOrNoEvent
} from "./actions";

//@ts-ignore
import TimebasedCondition from "./TimebasedCondition";

const Root = styled("div")`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 20px 0 10px;
`;
const Connector = styled("p")`
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.col.gray};
  text-align: center;
  margin: 5px auto;
`;
const AddBtn = styled(IconButton)`
  margin: 0 auto;
  display: block;
`;

type PropsType = {
  query: Record<string, any>;
  onDropTimebasedNode: () => void;
  onRemoveTimebasedNode: () => void;
  onAddTimebasedCondition: () => void;
  onRemoveTimebasedCondition: () => void;
  onSetTimebasedConditionOperator: () => void;
  onSetTimebasedNodeTimestamp: () => void;
  onSetTimebasedIndexResult: () => void;
  onSetTimebasedConditionMinDays: () => void;
  onSetTimebasedConditionMaxDays: () => void;
  onSetTimebasedConditionMinDaysOrNoEvent: () => void;
};

const TimebasedQueryEditor = (props: PropsType) => {
  return (
    /* eslint-disable */
    <Root>
      {
        //@ts-ignore
        props.query.conditions.map((condition, idx) => (
          <div key={`condition-${idx}`}>
            < // @ts-ignore
              TimebasedCondition
              /* eslint-enable */
              condition={condition}
              conditionIdx={idx}
              //@ts-ignore
              indexResult={props.query.indexResult}
              //@ts-ignore
              removable={props.query.conditions.length > 1}
              //@ts-ignore
              onRemove={() => props.onRemoveTimebasedCondition(idx)}
              //@ts-ignore
              onRemoveTimebasedNode={(resultIdx, moved) => {
                //@ts-ignore
                props.onRemoveTimebasedNode(idx, resultIdx, moved);
              }}
              //@ts-ignore
              onSetOperator={value =>
                //@ts-ignore
                props.onSetTimebasedConditionOperator(idx, value)
              }
              //@ts-ignore
              onDropTimebasedNode={(resultIdx, node, moved) => {
                //@ts-ignore
                props.onDropTimebasedNode(idx, resultIdx, node, moved);
              }}
              //@ts-ignore
              onSetTimebasedNodeTimestamp={(resultIdx, timestamp) => {
                //@ts-ignore
                props.onSetTimebasedNodeTimestamp(idx, resultIdx, timestamp);
              }}
              onSetTimebasedIndexResult={props.onSetTimebasedIndexResult}
              //@ts-ignore
              onSetTimebasedConditionMinDays={days => {
                //@ts-ignore
                props.onSetTimebasedConditionMinDays(idx, days);
              }}
              //@ts-ignore
              onSetTimebasedConditionMaxDays={days => {
                //@ts-ignore
                props.onSetTimebasedConditionMaxDays(idx, days);
              }}
              //@ts-ignore
              onSetTimebasedConditionMinDaysOrNoEvent={days => {
                //@ts-ignore
                props.onSetTimebasedConditionMinDaysOrNoEvent(idx, days);
              }}
            />

            <Connector>{T.translate("common.and")}</Connector>
          </div>
        ))
      }
      <AddBtn icon="plus" onClick={props.onAddTimebasedCondition}>
        {T.translate("timebasedQueryEditor.addCondition")}
      </AddBtn>
    </Root>
  );
};

//@ts-ignore
const mapStateToProps = state => ({
  query: state.timebasedQueryEditor.timebasedQuery
});

//@ts-ignore
const mapDispatchToProps = dispatch => ({
  onAddTimebasedCondition: () => dispatch(addTimebasedCondition()),
  //@ts-ignore
  onRemoveTimebasedCondition: idx => dispatch(removeTimebasedCondition(idx)),
  //@ts-ignore
  onSetTimebasedConditionOperator: (idx, value) =>
    dispatch(setTimebasedConditionOperator(idx, value)),
  //@ts-ignore
  onDropTimebasedNode: (conditionIdx, resultIdx, node, moved) =>
    dispatch(dropTimebasedNode(conditionIdx, resultIdx, node, moved)),
  //@ts-ignore
  onSetTimebasedNodeTimestamp: (conditionIdx, resultIdx, timestamp) =>
    dispatch(setTimebasedNodeTimestamp(conditionIdx, resultIdx, timestamp)),
  //@ts-ignore
  onRemoveTimebasedNode: (conditionIdx, resultIdx, moved) =>
    dispatch(removeTimebasedNode(conditionIdx, resultIdx, moved)),
  //@ts-ignore
  onSetTimebasedIndexResult: indexResult =>
    dispatch(setTimebasedIndexResult(indexResult)),
  //@ts-ignore
  onSetTimebasedConditionMinDays: (conditionIdx, days) =>
    dispatch(setTimebasedConditionMinDays(conditionIdx, days)),
  //@ts-ignore
  onSetTimebasedConditionMaxDays: (conditionIdx, days) =>
    dispatch(setTimebasedConditionMaxDays(conditionIdx, days)),
  //@ts-ignore
  onSetTimebasedConditionMinDaysOrNoEvent: (conditionIdx, days) =>
    dispatch(setTimebasedConditionMinDaysOrNoEvent(conditionIdx, days))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
  //@ts-ignore
)(TimebasedQueryEditor);
