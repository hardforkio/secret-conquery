import api from "../api";

import { defaultSuccess, defaultError } from "../common/actions";

import { capitalize, toUpperCaseUnderscore } from "../common/helpers";

import { loadPreviousQueries } from "../previous-queries/list/actions";

import * as actionTypes from "./actionTypes";
import { QUERY_AGAIN_TIMEOUT } from "./constants";

/*
  This implements a polling mechanism,
  because queries are running sometimes longer than 10s.
  (we're using "long polling", where the backend delays the response)

  The polling works like:
  - Start the query (POST request)
    - From the response, get an ID when query was successfully started
  - Continuously poll (GET request) for the query results using that ID
  - Stop polling once the status is DONE, CANCELED or FAILED

  Also, there's a possibility to stop a query while it's running,
  by sending a DELETE request for that query ID
*/

export default function createQueryRunnerActions(
  type: string,
  isExternalForm = false
  //@ts-ignore
): { [string]: Function } {
  const uppercaseType = toUpperCaseUnderscore(type);
  const capitalizedType = capitalize(type);

  //@ts-ignore
  const START_QUERY_START = actionTypes[`START_${uppercaseType}_QUERY_START`];
  const START_QUERY_SUCCESS =
    //@ts-ignore
    actionTypes[`START_${uppercaseType}_QUERY_SUCCESS`];
  //@ts-ignore
  const START_QUERY_ERROR = actionTypes[`START_${uppercaseType}_QUERY_ERROR`];
  //@ts-ignore
  const STOP_QUERY_START = actionTypes[`STOP_${uppercaseType}_QUERY_START`];
  //@ts-ignore
  const STOP_QUERY_SUCCESS = actionTypes[`STOP_${uppercaseType}_QUERY_SUCCESS`];
  //@ts-ignore
  const STOP_QUERY_ERROR = actionTypes[`STOP_${uppercaseType}_QUERY_ERROR`];
  //@ts-ignore
  const QUERY_RESULT_START = actionTypes[`QUERY_${uppercaseType}_RESULT_START`];
  //@ts-ignore
  const QUERY_RESULT_RESET = actionTypes[`QUERY_${uppercaseType}_RESULT_RESET`];
  const QUERY_RESULT_SUCCESS =
    //@ts-ignore
    actionTypes[`QUERY_${uppercaseType}_RESULT_SUCCESS`];
  //@ts-ignore
  const QUERY_RESULT_ERROR = actionTypes[`QUERY_${uppercaseType}_RESULT_ERROR`];

  const startQueryStart = () => ({ type: START_QUERY_START });
  //@ts-ignore
  const startQueryError = err => defaultError(START_QUERY_ERROR, err);
  //@ts-ignore
  const startQuerySuccess = res => defaultSuccess(START_QUERY_SUCCESS, res);
  const startQuery = (
    //@ts-ignore
    datasetId,
    //@ts-ignore
    query,
    //@ts-ignore
    version,
    //@ts-ignore
    formQueryTransformation?: Function = form => form
  ) => {
    //@ts-ignore
    return dispatch => {
      dispatch(startQueryStart());

      const apiMethod = isExternalForm
        ? //@ts-ignore
          (...args) => api.postFormQueries(...args, formQueryTransformation)
        : api.postQueries;

      //@ts-ignore
      return apiMethod(datasetId, query, type, version).then(
        r => {
          dispatch(startQuerySuccess(r));

          const queryId = r.id;

          return dispatch(queryResult(datasetId, queryId));
        },
        e => dispatch(startQueryError(e))
      );
    };
  };

  const stopQueryStart = () => ({ type: STOP_QUERY_START });
  //@ts-ignore
  const stopQueryError = err => defaultError(STOP_QUERY_ERROR, err);
  //@ts-ignore
  const stopQuerySuccess = res => defaultSuccess(STOP_QUERY_SUCCESS, res);
  //@ts-ignore
  const stopQuery = (datasetId, queryId) => {
    //@ts-ignore
    return dispatch => {
      dispatch(stopQueryStart());

      return api.deleteQuery(datasetId, queryId).then(
        r => dispatch(stopQuerySuccess(r)),
        e => dispatch(stopQueryError(e))
      );
    };
  };

  const queryResultStart = () => ({ type: QUERY_RESULT_START });
  const queryResultReset = () => ({ type: QUERY_RESULT_RESET });
  //@ts-ignore
  const queryResultError = err => defaultError(QUERY_RESULT_ERROR, err);
  //@ts-ignore
  const queryResultSuccess = (res, datasetId) =>
    defaultSuccess(QUERY_RESULT_SUCCESS, res, { datasetId });
  //@ts-ignore
  const queryResult = (datasetId, queryId) => {
    //@ts-ignore
    return dispatch => {
      dispatch(queryResultStart());

      return api.getQuery(datasetId, queryId).then(
        r => {
          // Indicate that looking for the result has stopped,
          // but not necessarily succeeded
          dispatch(queryResultReset());

          if (r.status === "DONE") {
            dispatch(queryResultSuccess(r, datasetId));

            // Now there should be a new result that can be queried
            dispatch(loadPreviousQueries(datasetId));
          } else if (r.status === "CANCELED") {
          } else if (r.status === "FAILED") {
            dispatch(queryResultError(r));
          } else {
            // Try again after a short time:
            //   Use the "long polling" strategy, where we assume that the
            //   backend blocks the request for a couple of seconds and waits
            //   for the query comes back.
            //   If it doesn't come back the request resolves and
            //   we - the frontend - try again almost instantly.
            setTimeout(
              () => dispatch(queryResult(datasetId, queryId)),
              QUERY_AGAIN_TIMEOUT
            );
          }
        },
        e => dispatch(queryResultError(e))
      );
    };
  };

  return {
    [`start${capitalizedType}QueryStart`]: startQueryStart,
    [`start${capitalizedType}QueryError`]: startQueryError,
    [`start${capitalizedType}QuerySuccess`]: startQuerySuccess,
    [`start${capitalizedType}Query`]: startQuery,
    [`stop${capitalizedType}QueryStart`]: stopQueryStart,
    [`stop${capitalizedType}QueryError`]: stopQueryError,
    [`stop${capitalizedType}QuerySuccess`]: stopQuerySuccess,
    [`stop${capitalizedType}Query`]: stopQuery,
    [`query${capitalizedType}ResultStart`]: queryResultStart,
    [`query${capitalizedType}ResultReset`]: queryResultReset,
    [`query${capitalizedType}ResultError`]: queryResultError,
    [`query${capitalizedType}ResultSuccess`]: queryResultSuccess,
    [`query${capitalizedType}Result`]: queryResult
  };
}
