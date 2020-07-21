import {
  UPDATE_PREVIOUS_QUERIES_SEARCH,
  ADD_TAG_TO_PREVIOUS_QUERIES_SEARCH
} from "./actionTypes";

export type PreviousQueriesSearchStateT = string[];

const initialState: PreviousQueriesSearchStateT = [];

const previousQueriesSearch = (
  state: PreviousQueriesSearchStateT = initialState,
  action: Record<string, any>
): PreviousQueriesSearchStateT => {
  // @ts-ignore
  switch (action.type) {
    case UPDATE_PREVIOUS_QUERIES_SEARCH:
      // @ts-ignore
      return action.payload.values;
    case ADD_TAG_TO_PREVIOUS_QUERIES_SEARCH:
      // @ts-ignore
      const { tag } = action.payload;

      // Only add tag if it doesn't exist
      return state.indexOf(tag) === -1 ? state.concat(tag) : state;
    default:
      return state;
  }
};

export default previousQueriesSearch;
