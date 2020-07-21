import T from "i18n-react";
import api from "../../api";

import { defaultSuccess, defaultError } from "../../common/actions";

import { setMessage } from "../../snack-message/actions";

import {
  LOAD_PREVIOUS_QUERIES_START,
  LOAD_PREVIOUS_QUERIES_SUCCESS,
  LOAD_PREVIOUS_QUERIES_ERROR,
  LOAD_PREVIOUS_QUERY_START,
  LOAD_PREVIOUS_QUERY_SUCCESS,
  LOAD_PREVIOUS_QUERY_ERROR,
  RENAME_PREVIOUS_QUERY_START,
  RENAME_PREVIOUS_QUERY_SUCCESS,
  RENAME_PREVIOUS_QUERY_ERROR,
  TOGGLE_EDIT_PREVIOUS_QUERY_LABEL,
  TOGGLE_EDIT_PREVIOUS_QUERY_TAGS,
  RETAG_PREVIOUS_QUERY_START,
  RETAG_PREVIOUS_QUERY_SUCCESS,
  RETAG_PREVIOUS_QUERY_ERROR,
  TOGGLE_SHARE_PREVIOUS_QUERY_START,
  TOGGLE_SHARE_PREVIOUS_QUERY_SUCCESS,
  TOGGLE_SHARE_PREVIOUS_QUERY_ERROR,
  DELETE_PREVIOUS_QUERY_START,
  DELETE_PREVIOUS_QUERY_SUCCESS,
  DELETE_PREVIOUS_QUERY_ERROR
} from "./actionTypes";

export const loadPreviousQueriesStart = () => ({
  type: LOAD_PREVIOUS_QUERIES_START
});
// @ts-ignore
export const loadPreviousQueriesSuccess = res =>
  defaultSuccess(LOAD_PREVIOUS_QUERIES_SUCCESS, res);
// @ts-ignore
export const loadPreviousQueriesError = err =>
  defaultError(LOAD_PREVIOUS_QUERIES_ERROR, err);

// @ts-ignore
export const loadPreviousQueries = datasetId => {
  // @ts-ignore
  return async dispatch => {
    dispatch(loadPreviousQueriesStart());

    try {
      const result = await api.getStoredQueries(datasetId);

      return dispatch(loadPreviousQueriesSuccess(result));
    } catch (e) {
      dispatch(setMessage("previousQueries.error"));

      return dispatch(loadPreviousQueriesError(e));
    }
  };
};

// @ts-ignore
export const loadPreviousQueryStart = queryId => ({
  type: LOAD_PREVIOUS_QUERY_START,
  payload: { queryId }
});
// @ts-ignore
export const loadPreviousQuerySuccess = (queryId, res) =>
  defaultSuccess(LOAD_PREVIOUS_QUERY_SUCCESS, res, { queryId });
// @ts-ignore
export const loadPreviousQueryError = (queryId, err) =>
  defaultError(LOAD_PREVIOUS_QUERY_ERROR, err, { queryId });

// @ts-ignore
export const loadPreviousQuery = (datasetId, queryId) => {
  // @ts-ignore
  return dispatch => {
    dispatch(loadPreviousQueryStart(queryId));

    return api.getStoredQuery(datasetId, queryId).then(
      r => dispatch(loadPreviousQuerySuccess(queryId, r)),
      //@ts-ignore
      e =>
        dispatch(
          loadPreviousQueryError(queryId, {
            message: T.translate("previousQuery.loadError")
          })
        )
    );
  };
};

// @ts-ignore
export const toggleEditPreviousQueryLabel = queryId => ({
  type: TOGGLE_EDIT_PREVIOUS_QUERY_LABEL,
  payload: { queryId }
});

// @ts-ignore
export const renamePreviousQueryStart = queryId => ({
  type: RENAME_PREVIOUS_QUERY_START,
  payload: { queryId }
});
// @ts-ignore
export const renamePreviousQuerySuccess = (queryId, label, res) =>
  defaultSuccess(RENAME_PREVIOUS_QUERY_SUCCESS, res, { queryId, label });
// @ts-ignore
export const renamePreviousQueryError = (queryId, err) =>
  defaultError(RENAME_PREVIOUS_QUERY_ERROR, err, { queryId });

// @ts-ignore
export const renamePreviousQuery = (datasetId, queryId, label) => {
  // @ts-ignore
  return dispatch => {
    dispatch(renamePreviousQueryStart(queryId));

    return api.patchStoredQuery(datasetId, queryId, { label }).then(
      r => {
        dispatch(renamePreviousQuerySuccess(queryId, label, r));
        dispatch(toggleEditPreviousQueryLabel(queryId));
      },
      //@ts-ignore
      e =>
        dispatch(
          renamePreviousQueryError(queryId, {
            message: T.translate("previousQuery.renameError")
          })
        )
    );
  };
};

// @ts-ignore
export const toggleEditPreviousQueryTags = queryId => ({
  type: TOGGLE_EDIT_PREVIOUS_QUERY_TAGS,
  payload: { queryId }
});

// @ts-ignore
export const retagPreviousQueryStart = queryId => ({
  type: RETAG_PREVIOUS_QUERY_START,
  payload: { queryId }
});
// @ts-ignore
export const retagPreviousQuerySuccess = (queryId, tags, res) =>
  defaultSuccess(RETAG_PREVIOUS_QUERY_SUCCESS, res, { queryId, tags });
// @ts-ignore
export const retagPreviousQueryError = (queryId, err) =>
  defaultError(RETAG_PREVIOUS_QUERY_ERROR, err, { queryId });

// @ts-ignore
export const retagPreviousQuery = (datasetId, queryId, tags) => {
  // @ts-ignore
  return dispatch => {
    dispatch(retagPreviousQueryStart(queryId));

    return api.patchStoredQuery(datasetId, queryId, { tags }).then(
      r => {
        dispatch(retagPreviousQuerySuccess(queryId, tags, r));
        dispatch(toggleEditPreviousQueryTags(queryId));
      },
      // @ts-ignore
      e =>
        dispatch(
          retagPreviousQueryError(queryId, {
            message: T.translate("previousQuery.retagError")
          })
        )
    );
  };
};

// @ts-ignore
export const toggleSharePreviousQueryStart = queryId => ({
  type: TOGGLE_SHARE_PREVIOUS_QUERY_START,
  payload: { queryId }
});
// @ts-ignore
export const toggleSharePreviousQuerySuccess = (queryId, shared, res) =>
  defaultSuccess(TOGGLE_SHARE_PREVIOUS_QUERY_SUCCESS, res, { queryId, shared });
// @ts-ignore
export const toggleSharePreviousQueryError = (queryId, err) =>
  defaultError(TOGGLE_SHARE_PREVIOUS_QUERY_ERROR, err, { queryId });

// @ts-ignore
export const toggleSharePreviousQuery = (datasetId, queryId, shared) => {
  // @ts-ignore
  return dispatch => {
    dispatch(toggleSharePreviousQueryStart(queryId));

    return api.patchStoredQuery(datasetId, queryId, { shared: shared }).then(
      r => dispatch(toggleSharePreviousQuerySuccess(queryId, shared, r)),
      //@ts-ignore
      e =>
        dispatch(
          toggleSharePreviousQueryError(queryId, {
            message: T.translate("previousQuery.shareError")
          })
        )
    );
  };
};

// @ts-ignore
export const deletePreviousQueryStart = queryId => ({
  type: DELETE_PREVIOUS_QUERY_START,
  payload: { queryId }
});
// @ts-ignore
export const deletePreviousQuerySuccess = (queryId, res) =>
  defaultSuccess(DELETE_PREVIOUS_QUERY_SUCCESS, res, { queryId });
// @ts-ignore
export const deletePreviousQueryError = (queryId, err) =>
  defaultError(DELETE_PREVIOUS_QUERY_ERROR, err, { queryId });

// @ts-ignore
export const deletePreviousQuery = (datasetId, queryId) => {
  // @ts-ignore
  return dispatch => {
    dispatch(deletePreviousQueryStart(queryId));

    return api.deleteStoredQuery(datasetId, queryId).then(
      r => dispatch(deletePreviousQuerySuccess(queryId, r)),
      //@ts-ignore
      e =>
        dispatch(
          deletePreviousQueryError(queryId, {
            message: T.translate("previousQuery.deleteError")
          })
        )
    );
  };
};
