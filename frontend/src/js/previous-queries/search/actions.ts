import {
  UPDATE_PREVIOUS_QUERIES_SEARCH,
  ADD_TAG_TO_PREVIOUS_QUERIES_SEARCH
} from "./actionTypes";

//@ts-ignore
export const updatePreviousQueriesSearch = values => ({
  type: UPDATE_PREVIOUS_QUERIES_SEARCH,
  payload: { values }
});

//@ts-ignore
export const addTagToPreviousQueriesSearch = tag => ({
  type: ADD_TAG_TO_PREVIOUS_QUERIES_SEARCH,
  payload: { tag }
});
