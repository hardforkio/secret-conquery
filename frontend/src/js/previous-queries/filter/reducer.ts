import { SET_PREVIOUS_QUERIES_FILTER } from "./actionTypes";

export type PreviousQueriesFilterStateT = string;

const initialState: PreviousQueriesFilterStateT = "all";

const previousQueriesFilter = (
  state: PreviousQueriesFilterStateT = initialState,
  action: Record<string, any>
): PreviousQueriesFilterStateT => {
  // @ts-ignore
  switch (action.type) {
    case SET_PREVIOUS_QUERIES_FILTER:
      // @ts-ignore
      return action.payload.filter;
    default:
      return state;
  }
};

export default previousQueriesFilter;
