// @flow

import T from 'i18n-react';

import {
  getConceptsByIdsWithTables
} from '../category-trees/globalTreeStoreHelper';

import {
  isEmpty,
  stripObject,
} from '../common/helpers';

import {
  TOGGLE_STANDARD_TABLE,
  SET_STANDARD_FILTER_VALUE,
  RESET_STANDARD_ALL_FILTERS,
  SWITCH_STANDARD_FILTER_MODE,
  TOGGLE_STANDARD_TIMESTAMPS,
  LOAD_STANDARD_FILTER_SUGGESTIONS_START,
  LOAD_STANDARD_FILTER_SUGGESTIONS_SUCCESS,
  LOAD_STANDARD_FILTER_SUGGESTIONS_ERROR
} from '../query-node-modal/actionTypes';

import {
  QUERY_GROUP_MODAL_SET_MIN_DATE,
  QUERY_GROUP_MODAL_SET_MAX_DATE,
  QUERY_GROUP_MODAL_RESET_ALL_DATES,
} from '../query-group-modal/actionTypes';

import {
  LOAD_PREVIOUS_QUERY_START,
  LOAD_PREVIOUS_QUERY_SUCCESS,
  LOAD_PREVIOUS_QUERY_ERROR,
  RENAME_PREVIOUS_QUERY_SUCCESS,
} from '../previous-queries/list/actionTypes';

import {
  UPLOAD_CONCEPT_LIST_MODAL_ACCEPT
} from '../upload-concept-list-modal/actionTypes'

import {
  INTEGER_RANGE
} from '../form-components';

import {
  DROP_AND_NODE,
  DROP_OR_NODE,
  DELETE_NODE,
  DELETE_GROUP,
  TOGGLE_EXCLUDE_GROUP,
  LOAD_QUERY,
  CLEAR_QUERY,
  EXPAND_PREVIOUS_QUERY,
  SHOW_CONCEPT_LIST_DETAILS,
  HIDE_CONCEPT_LIST_DETAILS,
} from './actionTypes';

import type {
  ElementType, QueryGroupType,
  StandardQueryType
} from './types';


const initialState: StandardQueryType = [];


const filterItem = (item: ElementType) => {
  return {
    id: item.id,
    label: item.label,
    description: item.description,
    tables: item.tables,
    additionalInfos: item.additionalInfos,
    matchingEntries: item.matchingEntries,
    hasActiveFilters: item.hasActiveFilters,
    excludeTimestamps: item.excludeTimestamps,
    isPreviousQuery: item.isPreviousQuery,

    ids: item.ids,
    isConceptList: item.isConceptList,
    conceptListMetadata: item.conceptListMetadata,
  };
};

const setGroupProperties = (node, andIdx, properties) => {
  return [
    ...node.slice(0, andIdx),
    {
      ...node[andIdx],
      ...properties
    },
    ...node.slice(andIdx + 1)
  ];
};

const setElementProperties = (node, andIdx, orIdx, properties) => {
  const groupProperties = {
    elements: [
      ...node[andIdx].elements.slice(0, orIdx),
      {
        ...node[andIdx].elements[orIdx],
        ...properties
      },
      ...node[andIdx].elements.slice(orIdx + 1)
    ]
  };

  return setGroupProperties(node, andIdx, groupProperties);
}

const setAllElementsProperties = (node, properties) => {
  return node.map(group => ({
    ...group,
    elements: group.elements.map(element => ({
      ...element,
      ...properties
    }))
  }));
}

const nodeHasActiveFilters = (node, tables = node.tables) => {
  return node.excludeTimestamps || nodeHasActiveTableFilters(tables);
}

const dropAndNode = (state, action) => {
  const group = state[state.length - 1];
  const dateRangeOfLastGroup = (group ? group.dateRange : null);
  const {item, dateRange = dateRangeOfLastGroup} = action.payload;

  const nextState = [
    ...state,
    {
      elements: [filterItem(item)],
      dateRange: dateRange
    },
  ];

  return item.moved
    ? deleteNode(nextState, { payload: { andIdx: item.andIdx, orIdx: item.orIdx } })
    : nextState;
};

const dropOrNode = (state, action) => {
  const { item, andIdx } = action.payload;

  const nextState = [
    ...state.slice(0, andIdx),
    {
      ...state[andIdx],
      elements: [
        filterItem(item),
        ...state[andIdx].elements,
      ]
    },
    ...state.slice(andIdx + 1)
  ];


  return item.moved
    ? item.andIdx === andIdx
      ? deleteNode(nextState, { payload: { andIdx: item.andIdx, orIdx: item.orIdx + 1 } })
      : deleteNode(nextState, { payload: { andIdx: item.andIdx, orIdx: item.orIdx } })
    : nextState;
};

// Delete a single Node (concept inside a group)
const deleteNode = (state, action) => {
  const { andIdx, orIdx } = action.payload;

  return [
    ...state.slice(0, andIdx),
    {
      ...state[andIdx],
      elements: [
        ...state[andIdx].elements.slice(0, orIdx),
        ...state[andIdx].elements.slice(orIdx + 1),
      ]
    },
    ...state.slice(andIdx + 1)
  ].filter(and => !!and.elements && and.elements.length > 0);
};

const deleteGroup = (state, action) => {
  const { andIdx } = action.payload;

  return [
    ...state.slice(0, andIdx),
    ...state.slice(andIdx + 1)
  ];
};

const toggleExcludeGroup = (state, action) => {
  const { andIdx } = action.payload;

  return [
    ...state.slice(0, andIdx),
    {
      ...state[andIdx],
      exclude: state[andIdx].exclude ? null : true
    },
    ...state.slice(andIdx + 1)
  ];
};

const loadQuery = (state, action) => {
  // In case there is no query, keep state the same
  if (!action.payload.query) return state;

  return action.payload.query;
};

const nodeHasActiveTableFilters = (tables) => {
  if (!tables) return false;

  // Check if there is any value in any of the filters
  const hasTableValue = tables
    .some(table =>
      table.filters &&
      table.filters.some(filter => !isEmpty(filter.value))
    );

  const hasExcludedTable = tables.some(table => table.exclude);

  return hasTableValue || hasExcludedTable;
};

const updateNodeTable = (state, andIdx, orIdx, tableIdx, table) => {
  const node = state[andIdx].elements[orIdx];
  const tables = [
    ...node.tables.slice(0, tableIdx),
    table,
    ...node.tables.slice(tableIdx + 1),
  ];

  return updateNodeTables(state, andIdx, orIdx, tables);
};

const updateNodeTables = (state, andIdx, orIdx, tables) => {
  const node = state[andIdx].elements[orIdx];

  const properties = {
    tables,
    hasActiveFilters: nodeHasActiveFilters(node, tables)
  }

  return setElementProperties(state, andIdx, orIdx, properties);
};

const toggleNodeTable = (state, action) => {
  const { andIdx, orIdx, tableIdx, isExcluded } = action.payload;
  const node = state[andIdx].elements[orIdx];
  const table = {
    ...node.tables[tableIdx],
    exclude: isExcluded
  };

  return updateNodeTable(state, andIdx, orIdx, tableIdx, table);
};


const setNodeFilterProperties = (state, action, obj) => {
  const { andIdx, orIdx, tableIdx, filterIdx } = action.payload;
  const table = state[andIdx].elements[orIdx].tables[tableIdx];
  const { filters } = table;

  if (!filters) return state;

  const filter = filters[filterIdx];

  // Go through the keys and set them to undefined if they're empty values
  // or empty objects
  const properties = stripObject(obj);

  if (properties.options) {
    // Options are only updated in the context of autocompletion.
    // In this case we don't want to replace the existing options but update
    // them with the new list, removing duplicates
    const previousOptions = filter.options || [];
    properties.options = properties.options
      .concat(previousOptions)
      .reduce(
        (options, currentOption) =>
          options.find(x => x.value === currentOption.value)
            ? options
            : [...options, currentOption],
        []
      );
  }

  const newTable = {
    ...table,
    filters: [
      ...filters.slice(0, filterIdx),
      {
        ...filter,
        ...properties
      },
      ...filters.slice(filterIdx + 1),
    ]
  };

  return updateNodeTable(state, andIdx, orIdx, tableIdx, newTable);
};

const setNodeFilterValue = (state, action) => {
  const { value } = action.payload;

  return setNodeFilterProperties(state, action, { value });
};

const switchNodeFilterMode = (state, action) => {
  const { mode } = action.payload;

  return setNodeFilterProperties(state, action, {
    mode,
    value: null
  });
};

const resetNodeAllFilters = (state, action) => {
  const { andIdx, orIdx } = action.payload;
  const node = state[andIdx].elements[orIdx];

  const newState = setElementProperties(state, andIdx, orIdx, {
    excludeTimestamps: false,
    hasActiveFilters: false,
  });

  if (!node.tables) return newState;

  const tables = node.tables.map(table => {
    const filters = table.filters
      // It's actually a FilterType, but flow can't decide which one
      // of the intersections it is
      // $FlowFixMe
      ? table.filters.map((filter) => ({
          ...filter,
          value: null
        }))
      : null;

    return {
      ...table,
      filters,
      exclude: false,
    };
  });

  return updateNodeTables(newState, andIdx, orIdx, tables);
};

const setGroupDate = (state, action, minOrMax) => {
  const { andIdx, date } = action.payload;

  // Calculate next daterange
  const tmpDateRange = {
    ...state[andIdx].dateRange,
    [minOrMax]: date
  };
  // Make sure it has either min or max set, otherwise "delete" the key
  // by setting to undefined
  const dateRange = (tmpDateRange.min || tmpDateRange.max)
    ? tmpDateRange
    : undefined;

  return setGroupProperties(state, andIdx, { dateRange });
};

const resetGroupDates = (state, action) => {
  const { andIdx } = action.payload;

  return setGroupProperties(state, andIdx, { dateRange: null });
};

// Merges filter values from `table` into declared filters from `savedTable`
//
// `savedTable` may define filters, but it won't have any filter values,
// since `savedTables` comes from a `savedConcept` in a `categoryTree`. Such a
// `savedConcept` is never modified and only declares possible filters.
// Since `table` comes from a previous query, it may have set filter values
// if so, we will need to merge them in.
const mergeFiltersFromSavedConcept = (savedTable, table) => {
  if (!table || !table.filters) return savedTable.filters || null;

  if (!savedTable.filters) return null;

  return savedTable.filters.map(savedTableFilter => {
    const tableFilter = table.filters.find(f => f.id === savedTableFilter.id) || {};
    const mode = tableFilter.type === INTEGER_RANGE
      ? tableFilter.value && !isEmpty(tableFilter.value.exact)
        ? { mode: 'exact' }
        : { mode: 'range' }
      : {}

    return {
      ...savedTableFilter,
      ...tableFilter, // => this one may contain a "value" property
      ...mode
    };
  })
}

// Look for tables in the already savedConcept. If they were not included in the
// respective query concept, exclude them.
// Also, apply all necessary filters
const mergeTablesFromSavedConcept = (savedConcept, concept) => {
  return savedConcept.tables
    ? savedConcept.tables.map(savedTable => {
        // Find corresponding table in previous queryObject
        const table = concept.tables.find(t => t.id === savedTable.id);
        const filters = mergeFiltersFromSavedConcept(savedTable, table);

        return {
          ...savedTable,
          exclude: !table,
          filters
        };
      })
   : [];
};

// Completely override all groups in the editor with the previous groups, but
// a) merge elements with concept data from category trees (esp. "tables")
// b) load nested previous queries contained in that query,
//    so they can also be expanded
const expandPreviousQuery = (state, action) => {
  const { rootConcepts, groups } = action.payload;

  return groups.map((group: QueryGroupType) => {
    return {
      ...group,
      elements: group.elements.map((element: ElementType) => {
        if (element.type === 'QUERY') {
          return {
            ...element,
            isPreviousQuery: true
          };
        } else if (element.type === 'CONCEPT_LIST') {
          const lookupResult = getConceptsByIdsWithTables(element.ids, rootConcepts);

          if (!lookupResult)
            return {
              ...element,
              error: T.translate('queryEditor.couldNotInsertConceptList')
            };

          const tables = mergeTablesFromSavedConcept(lookupResult, element);

          return {
            isConceptList: true,
            label: element.label,
            conceptListMetadata:
              buildConceptListMetadata(lookupResult.root, lookupResult.concepts),
            ids: element.ids,
            hasActiveFilters: nodeHasActiveFilters(element, tables),
            tables
          };
        } else {
          const lookupResult = getConceptsByIdsWithTables([element.id], rootConcepts);

          if (!lookupResult)
            return {
              ...element,
              error: T.translate('queryEditor.couldNotExpandNode')
            };

          const tables = mergeTablesFromSavedConcept(lookupResult, element);

          return {
            ...lookupResult.concepts[0],
            ...element,
            hasActiveFilters: nodeHasActiveFilters(element, tables),
            tables
          }
        }
      })
    }
  });
};

const showConceptListDetails = (state, action) => {
  const { andIdx, orIdx } = action.payload;

  return setElementProperties(state, andIdx, orIdx, { showDetails: true });
}

const hideConceptListDetails = (state, action) => {
  return setAllElementsProperties(state, { showDetails: false });
}

const findPreviousQueries = (state, action) => {
  // Find all nodes that are previous queries and have the correct id
  const queries = state
    .map((group, andIdx) => {
      return group.elements
        .map((concept, orIdx) => ({ ...concept, orIdx }))
        .filter(concept => concept.isPreviousQuery && concept.id === action.payload.queryId)
        .map(concept => ({
          andIdx,
          orIdx: concept.orIdx,
          node: concept,
        }));
    })
    .filter(group => group.length > 0)

  return [].concat.apply([], queries);
};

const updatePreviousQueries = (state, action, attributes) => {
  const queries = findPreviousQueries(state, action);

  return queries.reduce((nextState, query) => {
    const { node, andIdx, orIdx } = query;

    return [
      ...nextState.slice(0, andIdx),
      {
        ...nextState[andIdx],
        elements: [
          ...nextState[andIdx].elements.slice(0, orIdx),
          {
            ...node,
            ...attributes
          },
          ...nextState[andIdx].elements.slice(orIdx + 1)
        ]
      },
      ...nextState.slice(andIdx + 1)
    ];
  }, state);
};

const loadPreviousQueryStart = (state, action) => {
  return updatePreviousQueries(state, action, { loading: true });
};
const loadPreviousQuerySuccess = (state, action) => {
  const label = action.payload.data.label
    ? { label: action.payload.data.label }
    : {};

  return updatePreviousQueries(state, action, {
    ...label,
    id: action.payload.data.id,
    loading: false,
    query: action.payload.data.query
  });
};
const loadPreviousQueryError = (state, action) => {
  return updatePreviousQueries(state, action, { loading: false, error: action.payload.message });
};
const renamePreviousQuery = (state, action) => {
  return updatePreviousQueries(state, action, { loading: false, label: action.payload.label });
};

const toggleTimestamps = (state, action) => {
  const { andIdx, orIdx, isExcluded } = action.payload;
  const node = state[andIdx].elements[orIdx];

  return setElementProperties(state, andIdx, orIdx, {
    hasActiveFilters: isExcluded || nodeHasActiveTableFilters(node.tables),
    excludeTimestamps: isExcluded
  });
};

const loadFilterSuggestionsStart = (state, action) =>
  setNodeFilterProperties(state, action, { isLoading: true });

const loadFilterSuggestionsSuccess = (state, action) =>
  setNodeFilterProperties(state, action, {
    isLoading: false,
    options: action.payload.suggestions.map(option => ({
      label: option.label,
      value: option.value
    }))
  });

const loadFilterSuggestionsError = (state, action) =>
  setNodeFilterProperties(state, action, { isLoading: false, options: [] });

const buildConceptListMetadata = (root, concepts) => ({
  root: root.label,
  concepts: concepts.map(c => ({ label: c.label, description: c.description }))
});

const insertUploadedConceptList = (state, action) => {
  const { label, rootConcepts, resolutionResult, queryContext } = action.data;

  let queryElement = { error: T.translate('queryEditor.couldNotInsertConceptList') };

  if (resolutionResult.conceptList) {
    const lookupResult = getConceptsByIdsWithTables(resolutionResult.conceptList, rootConcepts);

    if (lookupResult)
      queryElement = {
        label,
        conceptListMetadata:
          buildConceptListMetadata(lookupResult.root, lookupResult.concepts),
        ids: resolutionResult.conceptList,
        tables: lookupResult.tables,
        isConceptList: true
      };
  } else if (resolutionResult.filter) {
    const [conceptRoot] =
      getConceptsByIdsWithTables([resolutionResult.selectedRoot], rootConcepts).concepts;
    const resolvedTable = {
      id: resolutionResult.filter.tableId,
      filters: [{
          id: resolutionResult.filter.filterId,
          value: resolutionResult.filter.value.map(filterValue => filterValue.value),
          options: resolutionResult.filter.value,
      }]
    };
    const tables = conceptRoot.tables.map(table => ({
      ...table,
      filters: mergeFiltersFromSavedConcept(resolvedTable, table)
    }));

    queryElement = {
      ...filterItem(conceptRoot),
      tables,
      hasActiveFilters: true
    };
  }

  if (queryContext.andIdx !== undefined && queryContext.andIdx !== null)
    return dropOrNode(state, { payload: { item: queryElement, andIdx: queryContext.andIdx } });

  return dropAndNode(state, { payload: { item: queryElement, dateRange: queryContext.dateRange } });
};

// Query is an array of "groups" (a AND b and c)
// where a, b, c are objects, that (can) have properites,
// like `dateRange` or `exclude`.
// But the main property is "elements" - an array of objects
// that contain at least an ID.
// An element may contain an array of tables that may
// either be excluded, or contain an array of filters with values.
//
// Example:
// [
//   {
//     elements: [
//       { id: 9, tables: [{ id: 1}] },
//       {
//         id: 10,
//         tables: [
//           { id: 213, exclude: true },
//           {
//             id: 452,
//             filters: [
//               { id: 52, type: 'INTEGER_RANGE', value: { min: 2, max: 3 } }
//               { id: 53, type: 'SELECT', value: "Some example filter value" }
//             ]
//           }
//         ]
//       }
//     ]
//   }, {
//     elements: [
//      {id: 6, tables: []}, {id: 7, tables: []}, {id: 5, tables: []}
//     ]
//   }
// ]
const query = (
  state: StandardQueryType = initialState,
  action: Object
): StandardQueryType => {
  switch (action.type) {
    case DROP_AND_NODE:
      return dropAndNode(state, action);
    case DROP_OR_NODE:
      return dropOrNode(state, action);
    case DELETE_NODE:
      return deleteNode(state, action);
    case DELETE_GROUP:
      return deleteGroup(state, action);
    case TOGGLE_EXCLUDE_GROUP:
      return toggleExcludeGroup(state, action);
    case LOAD_QUERY:
      return loadQuery(state, action);
    case CLEAR_QUERY:
      return initialState;
    case TOGGLE_STANDARD_TABLE:
      return toggleNodeTable(state, action);
    case SET_STANDARD_FILTER_VALUE:
      return setNodeFilterValue(state, action);
    case RESET_STANDARD_ALL_FILTERS:
      return resetNodeAllFilters(state, action);
    case SWITCH_STANDARD_FILTER_MODE:
      return switchNodeFilterMode(state, action);
    case TOGGLE_STANDARD_TIMESTAMPS:
      return toggleTimestamps(state, action);
    case QUERY_GROUP_MODAL_SET_MIN_DATE:
      return setGroupDate(state, action, 'min');
    case QUERY_GROUP_MODAL_SET_MAX_DATE:
      return setGroupDate(state, action, 'max');
    case QUERY_GROUP_MODAL_RESET_ALL_DATES:
      return resetGroupDates(state, action);
    case EXPAND_PREVIOUS_QUERY:
      return expandPreviousQuery(state, action)
    case SHOW_CONCEPT_LIST_DETAILS:
      return showConceptListDetails(state, action);
    case HIDE_CONCEPT_LIST_DETAILS:
      return hideConceptListDetails(state);
    case LOAD_PREVIOUS_QUERY_START:
      return loadPreviousQueryStart(state, action);
    case LOAD_PREVIOUS_QUERY_SUCCESS:
      return loadPreviousQuerySuccess(state, action);
    case LOAD_PREVIOUS_QUERY_ERROR:
      return loadPreviousQueryError(state, action);
    case RENAME_PREVIOUS_QUERY_SUCCESS:
      return renamePreviousQuery(state, action)
    case LOAD_STANDARD_FILTER_SUGGESTIONS_START:
      return loadFilterSuggestionsStart(state, action);
    case LOAD_STANDARD_FILTER_SUGGESTIONS_SUCCESS:
      return loadFilterSuggestionsSuccess(state, action);
    case LOAD_STANDARD_FILTER_SUGGESTIONS_ERROR:
      return loadFilterSuggestionsError(state, action);
    case UPLOAD_CONCEPT_LIST_MODAL_ACCEPT:
      return insertUploadedConceptList(state, action);
    default:
      return state;
  }
};

export default query;