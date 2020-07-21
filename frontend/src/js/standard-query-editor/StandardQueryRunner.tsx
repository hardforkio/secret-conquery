import { connect } from "react-redux";
//@ts-ignore
import type { Dispatch } from "redux-thunk";

import QueryRunner from "../query-runner/QueryRunner";

import { validateQueryLength, validateQueryDates } from "../model/query";

import actions from "../app/actions";

//@ts-ignore
const { startStandardQuery, stopStandardQuery } = actions;

//@ts-ignore
function validateQueryStartStop(queryRunner) {
  return !queryRunner.startQuery.loading && !queryRunner.stopQuery.loading;
}

//@ts-ignore
function validateDataset(datasetId) {
  return datasetId !== null;
}

//@ts-ignore
function getButtonTooltipKey(hasQueryValidDates) {
  if (!hasQueryValidDates) {
    return "queryRunner.errorDates";
  }

  // Potentially add further validation and more detailed messages

  return null;
}

//@ts-ignore
const mapStateToProps = (state, ownProps) => {
  const { query, queryRunner } = state.queryEditor;

  const isDatasetValid = validateDataset(ownProps.datasetId);
  const hasQueryValidDates = validateQueryDates(query);
  const isQueryValid = validateQueryLength(query) && hasQueryValidDates;
  const isQueryNotStartedOrStopped = validateQueryStartStop(queryRunner);

  const isButtonEnabled =
    isDatasetValid && isQueryValid && isQueryNotStartedOrStopped;

  const buttonTooltipKey = getButtonTooltipKey(hasQueryValidDates);

  return {
    buttonTooltipKey,
    isButtonEnabled,
    query,
    queryRunner,
    isQueryRunning: !!queryRunner.runningQuery,
    queryId: queryRunner.runningQuery,
    version: state.conceptTrees.version
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  //@ts-ignore
  startQuery: (datasetId, query, version) =>
    dispatch(startStandardQuery(datasetId, query, version)),
  //@ts-ignore
  stopQuery: (datasetId, queryId) =>
    dispatch(stopStandardQuery(datasetId, queryId))
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

export const StandardQueryRunner = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QueryRunner);
