import type { ConceptT, ConceptIdT } from "../api/types";

import {
  LOAD_TREES_START,
  LOAD_TREES_SUCCESS,
  LOAD_TREES_ERROR,
  LOAD_TREE_START,
  LOAD_TREE_SUCCESS,
  LOAD_TREE_ERROR,
  CLEAR_TREES,
  SEARCH_TREES_START,
  SEARCH_TREES_SUCCESS,
  SEARCH_TREES_ERROR,
  CLEAR_SEARCH_QUERY,
  TOGGLE_SHOW_MISMATCHES
} from "./actionTypes";

import { setTree } from "./globalTreeStoreHelper";

export type TreesT = { [treeId: string]: ConceptT };

export type SearchT = {
  allOpen: boolean;
  showMismatches: boolean;
  loading: boolean;
  query: string;
  words: string[] | null;
  // @ts-ignore
  result: null | { [key: ConceptIdT]: number };
  resultCount: number;
  duration: number;
};

export type ConceptTreesStateT = {
  loading: boolean;
  version: any;
  trees: TreesT;
  search: SearchT;
};

const initialSearch = {
  allOpen: false,
  showMismatches: true,
  loading: false,
  query: "",
  words: null,
  result: null,
  resultCount: 0,
  duration: 0
};

const initialState: ConceptTreesStateT = {
  loading: false,
  version: null,
  trees: {},
  search: initialSearch
};

const setSearchTreesSuccess = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  // @ts-ignore
  const { query, result } = action.payload;

  // only create keys array once, then cache,
  // since the result might be > 100k entries
  const resultCount = Object.keys(result).length;
  const AUTO_UNFOLD_AT = 300;

  return {
    ...state,
    search: {
      ...state.search,
      query,
      result,
      resultCount,
      allOpen: resultCount < AUTO_UNFOLD_AT,
      showMismatches: resultCount >= AUTO_UNFOLD_AT,
      loading: false,
      words: query.split(" "),
      duration: Date.now() - state.search.duration
    }
  };
};

const setSearchTreesStart = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  // @ts-ignore
  const { query } = action.payload;

  return {
    ...state,
    search: {
      ...state.search,
      loading: query && query.length > 0,
      query: query,
      words: query ? query.split(" ") : [],
      result: {},
      resultCount: 0,
      duration: Date.now()
    }
  };
};

const updateTree = (
  state: ConceptTreesStateT,
  action: Record<string, any>,
  attributes: Record<string, any>
): ConceptTreesStateT => {
  return {
    ...state,
    trees: {
      ...state.trees,
      // @ts-ignore
      [action.payload.treeId]: {
        // @ts-ignore
        ...state.trees[action.payload.treeId],
        ...attributes
      }
    }
  };
};

const setTreeLoading = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  return updateTree(state, action, { loading: true });
};

const setTreeSuccess = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  // Side effect in a reducer.
  // Globally store the huge (1-5 MB) trees for read only
  // - keeps the redux store free from huge data
  // @ts-ignore
  const { treeId, data } = action.payload;
  const newState = updateTree(state, action, { loading: false });

  const rootConcept = newState.trees[treeId];

  // @ts-ignore
  setTree(rootConcept, treeId, data);

  return newState;
};

const setTreeError = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  return updateTree(state, action, {
    loading: false,
    // @ts-ignore
    error: action.payload.message
  });
};

const setLoadTreesSuccess = (
  state: ConceptTreesStateT,
  action: Record<string, any>
): ConceptTreesStateT => {
  // @ts-ignore
  const { concepts, version } = action.payload.data;

  // Assign default select filter values
  /* eslint-disable */
  for (const concept of Object.values(concepts))
    // @ts-ignore
    for (const table of concept.tables || [])
      for (const filter of table.filters || [])
        if (filter.defaultValue) filter.value = filter.defaultValue;

  /* eslint-enable */
  return {
    ...state,
    loading: false,
    version: version,
    trees: concepts
  };
};

const conceptTrees = (
  state: ConceptTreesStateT = initialState,
  action: Record<string, any>
): ConceptTreesStateT => {
  // @ts-ignore
  switch (action.type) {
    // All trees
    case LOAD_TREES_START:
      return { ...state, loading: true };
    case LOAD_TREES_SUCCESS:
      return setLoadTreesSuccess(state, action);
    case LOAD_TREES_ERROR:
      // @ts-ignore
      return { ...state, loading: false, error: action.payload.message };

    // Individual tree:
    case LOAD_TREE_START:
      return setTreeLoading(state, action);
    case LOAD_TREE_SUCCESS:
      return setTreeSuccess(state, action);
    case LOAD_TREE_ERROR:
      return setTreeError(state, action);

    case CLEAR_TREES:
      return initialState;

    case SEARCH_TREES_START:
      return setSearchTreesStart(state, action);
    case SEARCH_TREES_SUCCESS:
      return setSearchTreesSuccess(state, action);
    case SEARCH_TREES_ERROR:
      return {
        ...state,
        search: { ...state.search, loading: false, duration: 0 },
        // @ts-ignore
        error: action.payload.message
      };
    case CLEAR_SEARCH_QUERY:
      return {
        ...state,
        search: initialSearch
      };
    case TOGGLE_SHOW_MISMATCHES:
      return {
        ...state,
        search: {
          ...state.search,
          allOpen: !state.search.showMismatches ? false : state.search.allOpen,
          showMismatches: !state.search.showMismatches
        }
      };
    default:
      return state;
  }
};

export default conceptTrees;
