import { connect } from "react-redux";

import actions from "../app/actions";
import QueryRunner from "../query-runner/QueryRunner";

import { allConditionsFilled } from "./helpers";
//@ts-ignore
import React from "react";

//@ts-ignore
const { startTimebasedQuery, stopTimebasedQuery } = actions;

//@ts-ignore
function isButtonEnabled(state, ownProps) {
  return !!(
    ownProps.datasetId !== null &&
    !state.timebasedQueryEditor.timebasedQueryRunner.startQuery.loading &&
    !state.timebasedQueryEditor.timebasedQueryRunner.stopQuery.loading &&
    allConditionsFilled(state.timebasedQueryEditor.timebasedQuery)
  );
}

//@ts-ignore
const mapStateToProps = (state, ownProps) => ({
  queryRunner: state.timebasedQueryEditor.timebasedQueryRunner,
  isButtonEnabled: isButtonEnabled(state, ownProps),
  isQueryRunning: !!state.timebasedQueryEditor.timebasedQueryRunner
    .runningQuery,
  // Following ones only needed in dispatch functions
  queryId: state.timebasedQueryEditor.timebasedQueryRunner.runningQuery,
  version: state.conceptTrees.version,
  query: state.timebasedQueryEditor.timebasedQuery
});

//@ts-ignore
const mapDispatchToProps = dispatch => ({
  //@ts-ignore
  startQuery: (datasetId, query, version) =>
    dispatch(startTimebasedQuery(datasetId, query, version)),
  //@ts-ignore
  stopQuery: (datasetId, queryId) =>
    dispatch(stopTimebasedQuery(datasetId, queryId))
});

//@ts-ignore
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  startQuery: () =>
    dispatchProps.startQuery(
      ownProps.datasetId,
      stateProps.query,
      stateProps.version
    ),
  stopQuery: () =>
    dispatchProps.stopQuery(ownProps.datasetId, stateProps.queryId)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QueryRunner);
