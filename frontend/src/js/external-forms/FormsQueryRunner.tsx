import { connect } from "react-redux";
import { isValid, isPristine, getFormValues } from "redux-form";

import transformQueryToApi from "./transformQueryToApi";
import * as actions from "./actions";
import {
  selectReduxFormState,
  selectFormConfig,
  selectQueryRunner,
  selectRunningQuery,
  selectActiveFormType
} from "./stateSelectors";

import QueryRunner from "../query-runner/QueryRunner";

const { startExternalFormsQuery, stopExternalFormsQuery } = actions;

//@ts-ignore
const isActiveFormValid = state => {
  const activeForm = selectActiveFormType(state);

  if (!activeForm) return false;

  return (
    //@ts-ignore
    !isPristine(activeForm, selectReduxFormState)(state) &&
    //@ts-ignore
    isValid(activeForm, selectReduxFormState)(state)
  );
};

//@ts-ignore
const isButtonEnabled = (state, ownProps) => {
  const queryRunner = selectQueryRunner(state);

  if (!queryRunner) return false;

  return !!(
    ownProps.datasetId !== null &&
    !queryRunner.startQuery.loading &&
    !queryRunner.stopQuery.loading &&
    isActiveFormValid(state)
  );
};

//@ts-ignore
const mapStateToProps = (state, ownProps) => ({
  queryRunner: selectQueryRunner(state),
  isButtonEnabled: isButtonEnabled(state, ownProps),
  isQueryRunning: !!selectRunningQuery(state),
  // Following ones only needed in dispatch functions
  queryId: selectRunningQuery(state),
  version: state.conceptTrees.version,
  query: {
    formName: selectActiveFormType(state),
    form: selectActiveFormType(state)
      ? //@ts-ignore
        getFormValues(selectActiveFormType(state), selectReduxFormState)(state)
      : {}
  },
  //@ts-ignore
  formQueryTransformation: transformQueryToApi(selectFormConfig(state))
});

//@ts-ignore
const mapDispatchToProps = (dispatch: Dispatch) => ({
  //@ts-ignore
  startQuery: (datasetId, query, version, formQueryTransformation) =>
    dispatch(
      startExternalFormsQuery(
        datasetId,
        query,
        version,
        formQueryTransformation
      )
    ),
  //@ts-ignore
  stopQuery: (datasetId, queryId) =>
    dispatch(stopExternalFormsQuery(datasetId, queryId))
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
      stateProps.version,
      stateProps.formQueryTransformation
    ),
  stopQuery: () =>
    dispatchProps.stopQuery(ownProps.datasetId, stateProps.queryId)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QueryRunner);
