import T from "i18n-react";
import { toUpperCaseUnderscore } from "../common/helpers";
import * as actionTypes from "./actionTypes";

type APICallType = {
  loading?: boolean;
  success?: boolean;
  error?: string;
};

export type QueryRunnerStateT = {
  runningQuery: number | string | null;
  queryRunning: boolean;
  startQuery: APICallType;
  stopQuery: APICallType;
  queryResult:
    | (APICallType & {
        datasetId?: string;
        resultCount?: number;
        resultUrl?: string;
      })
    | null;
};

export default function createQueryRunnerReducer(type: string) {
  const initialState: QueryRunnerStateT = {
    runningQuery: null,
    queryRunning: false,
    startQuery: {},
    stopQuery: {},
    queryResult: null
  };

  const capitalType = toUpperCaseUnderscore(type);

  // Example1: START_STANDARD_QUERY_START
  // Example2: START_TIMEBASED_QUERY_START
  // @ts-ignore
  const START_QUERY_START = actionTypes[`START_${capitalType}_QUERY_START`];
  // @ts-ignore
  const START_QUERY_SUCCESS = actionTypes[`START_${capitalType}_QUERY_SUCCESS`];
  // @ts-ignore
  const START_QUERY_ERROR = actionTypes[`START_${capitalType}_QUERY_ERROR`];
  // @ts-ignore
  const STOP_QUERY_START = actionTypes[`STOP_${capitalType}_QUERY_START`];
  // @ts-ignore
  const STOP_QUERY_SUCCESS = actionTypes[`STOP_${capitalType}_QUERY_SUCCESS`];
  // @ts-ignore
  const STOP_QUERY_ERROR = actionTypes[`STOP_${capitalType}_QUERY_ERROR`];
  // @ts-ignore
  const QUERY_RESULT_START = actionTypes[`QUERY_${capitalType}_RESULT_START`];
  // @ts-ignore
  const QUERY_RESULT_RESET = actionTypes[`QUERY_${capitalType}_RESULT_RESET`];
  const QUERY_RESULT_SUCCESS =
    // @ts-ignore
    actionTypes[`QUERY_${capitalType}_RESULT_SUCCESS`];
  // @ts-ignore
  const QUERY_RESULT_ERROR = actionTypes[`QUERY_${capitalType}_RESULT_ERROR`];

  // @ts-ignore
  const getQueryResult = (data, datasetId) => {
    if (data.status === "CANCELED")
      return {
        loading: false,
        error: T.translate("queryRunner.queryCanceled")
      };
    else if (data.status === "FAILED")
      return { loading: false, error: T.translate("queryRunner.queryFailed") };

    // E.G. STATUS DONE
    return {
      datasetId,
      loading: false,
      success: true,
      error: null,
      resultCount: data.numberOfResults,
      resultUrl: data.resultUrl
    };
  };

  return (
    state: QueryRunnerStateT = initialState,
    action: Record<string, any>
  ): QueryRunnerStateT => {
    // @ts-ignore
    switch (action.type) {
      // To start a query
      case START_QUERY_START:
        return {
          ...state,
          stopQuery: {},
          startQuery: { loading: true },
          queryResult: null
        };
      case START_QUERY_SUCCESS:
        return {
          ...state,
          // @ts-ignore
          runningQuery: action.payload.data.id,
          queryRunning: true,
          stopQuery: {},
          startQuery: { success: true }
        };
      case START_QUERY_ERROR:
        return {
          ...state,
          stopQuery: {},
          startQuery: {
            // @ts-ignore
            error: action.payload.message || action.payload.status
          }
        };

      // To cancel a query
      case STOP_QUERY_START:
        return { ...state, startQuery: {}, stopQuery: { loading: true } };
      case STOP_QUERY_SUCCESS:
        return {
          ...state,
          runningQuery: null,
          queryRunning: false,
          startQuery: {},
          stopQuery: { success: true }
        };
      case STOP_QUERY_ERROR:
        return {
          ...state,
          startQuery: {},
          // @ts-ignore
          stopQuery: { error: action.payload.message || action.payload.status }
        };

      // To check for query results
      case QUERY_RESULT_START:
        return { ...state, queryResult: { loading: true } };
      case QUERY_RESULT_RESET:
        return { ...state, queryResult: { loading: false } };
      case QUERY_RESULT_SUCCESS:
        // @ts-ignore
        const { data, datasetId } = action.payload;

        const queryResult = getQueryResult(data, datasetId);

        return {
          ...state,
          // @ts-ignore
          queryResult,
          runningQuery: null,
          queryRunning: false
        };
      case QUERY_RESULT_ERROR:
        return {
          ...state,
          runningQuery: null,
          queryRunning: false,
          queryResult: {
            loading: false,
            error:
              // @ts-ignore
              action.payload.message || T.translate("queryRunner.queryFailed")
          }
        };
      default:
        return state;
    }
  };
}
