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

export interface PreviousQueryT {
  id: number | string;
  label: string;
  loading: boolean;
  error: string | null;
  numberOfResults: number;
  createdAt: string;
  tags: string[];
  own: boolean;
  shared: boolean;
}

export interface PreviousQueriesStateT {
  queries: PreviousQueryT[];
  loading: boolean;
  tags: string[];
  names: string[];
  error: string | null;
}

const initialState: PreviousQueriesStateT = {
  queries: [],
  loading: false,
  tags: [],
  names: [],
  error: null
};

const findQuery = (queries: PreviousQueryT[], queryId: string | number) => {
  const query = queries.find(q => q.id === queryId);

  return {
    query,
    queryIdx: query ? queries.indexOf(query) : -1
  };
};

const updatePreviousQuery = (
  state: PreviousQueriesStateT,
  action: Record<string, any>,
  attributes: Partial<PreviousQueryT>
) => {
  // @ts-ignore
  const { query, queryIdx } = findQuery(state.queries, action.payload.queryId);

  if (!query) return state;

  return {
    ...state,
    queries: [
      ...state.queries.slice(0, queryIdx),
      {
        ...query,
        ...attributes
      },
      ...state.queries.slice(queryIdx + 1)
    ]
  };
};

const sortQueries = (queries: PreviousQueryT[]) => {
  return queries.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

const toggleQueryAttribute = (
  state: PreviousQueriesStateT,
  action: Record<string, any>,
  attribute: keyof PreviousQueryT
) => {
  // @ts-ignore
  const { query } = findQuery(state.queries, action.payload.queryId);

  if (!query) return state;

  return updatePreviousQuery(state, action, { [attribute]: !query[attribute] });
};

const deletePreviousQuery = (
  state: PreviousQueriesStateT,
  action: Record<string, any>
) => {
  // @ts-ignore
  const { queryIdx } = findQuery(state.queries, action.payload.queryId);

  return {
    ...state,
    queries: [
      ...state.queries.slice(0, queryIdx),
      ...state.queries.slice(queryIdx + 1)
    ]
  };
};

const findUniqueTags = (queries: PreviousQueryT[]) => {
  const uniqueTags = new Set<string>();

  queries.forEach(query => {
    if (query.tags) query.tags.forEach(tag => uniqueTags.add(tag));
  });

  return Array.from(uniqueTags);
};

const findNewTags = (tags: string[]) => {
  if (!tags) return [];

  const uniqueTags = new Set<string>();

  tags.forEach(tag => uniqueTags.add(tag));

  return Array.from(uniqueTags);
};

const findUniqueNames = (queries: PreviousQueryT[]) => {
  const uniqueNames = new Set<string>();

  queries.filter(q => !!q.label).forEach(q => uniqueNames.add(q.label));

  return Array.from(uniqueNames);
};

const updateUniqueNames = (existingNames: string[], newName: string) => {
  return existingNames.includes(newName)
    ? existingNames
    : [newName, ...existingNames];
};

const previousQueriesReducer = (
  state: PreviousQueriesStateT = initialState,
  action: Record<string, any>
): PreviousQueriesStateT => {
  // @ts-ignore
  switch (action.type) {
    case LOAD_PREVIOUS_QUERIES_START:
      return { ...state, loading: true };
    case LOAD_PREVIOUS_QUERIES_SUCCESS:
      return {
        ...state,
        loading: false,
        // @ts-ignore
        queries: sortQueries(action.payload.data),
        // @ts-ignore
        tags: findUniqueTags(action.payload.data),
        // @ts-ignore
        names: findUniqueNames(action.payload.data)
      };
    case LOAD_PREVIOUS_QUERIES_ERROR:
      // @ts-ignore
      return { ...state, loading: false, error: action.payload.message };
    case LOAD_PREVIOUS_QUERY_START:
    case RENAME_PREVIOUS_QUERY_START:
    case RETAG_PREVIOUS_QUERY_START:
    case TOGGLE_SHARE_PREVIOUS_QUERY_START:
    case DELETE_PREVIOUS_QUERY_START:
      return updatePreviousQuery(state, action, { loading: true });
    case LOAD_PREVIOUS_QUERY_SUCCESS:
      return updatePreviousQuery(state, action, {
        loading: false,
        error: null,
        // @ts-ignore
        ...action.payload.data
      });
    case RENAME_PREVIOUS_QUERY_SUCCESS:
      return {
        ...updatePreviousQuery(state, action, {
          loading: false,
          error: null,
          // @ts-ignore
          label: action.payload.label
        }),
        // @ts-ignore
        names: updateUniqueNames(state.names, action.payload.label)
      };
    case RETAG_PREVIOUS_QUERY_SUCCESS:
      return {
        ...updatePreviousQuery(state, action, {
          loading: false,
          error: null,
          // @ts-ignore
          tags: action.payload.tags
        }),
        // @ts-ignore
        tags: findNewTags([...state.tags, ...action.payload.tags])
      };
    case TOGGLE_SHARE_PREVIOUS_QUERY_SUCCESS:
      return updatePreviousQuery(state, action, {
        loading: false,
        error: null,
        // @ts-ignore
        shared: action.payload.shared
      });
    case DELETE_PREVIOUS_QUERY_SUCCESS:
      return deletePreviousQuery(state, action);
    case LOAD_PREVIOUS_QUERY_ERROR:
    case RENAME_PREVIOUS_QUERY_ERROR:
    case RETAG_PREVIOUS_QUERY_ERROR:
    case TOGGLE_SHARE_PREVIOUS_QUERY_ERROR:
    case DELETE_PREVIOUS_QUERY_ERROR:
      return updatePreviousQuery(state, action, {
        loading: false,
        // @ts-ignore
        error: action.payload.message
      });
    case TOGGLE_EDIT_PREVIOUS_QUERY_LABEL:
      // @ts-ignore
      return toggleQueryAttribute(state, action, "editingLabel");
    case TOGGLE_EDIT_PREVIOUS_QUERY_TAGS:
      // @ts-ignore
      return toggleQueryAttribute(state, action, "editingTags");
    default:
      return state;
  }
};

export default previousQueriesReducer;
