import type { DatasetIdT } from "../api/types";

import {
  LOAD_DATASETS_START,
  LOAD_DATASETS_SUCCESS,
  LOAD_DATASETS_ERROR,
  SELECT_DATASET,
  SAVE_QUERY
} from "./actionTypes";

export type DatasetT = {
  id: DatasetIdT;
  label: string;
};

export type DatasetStateT = {
  pristine: boolean;
  loading: boolean;
  error: string | null;
  data: DatasetT[];
  selectedDatasetId: DatasetIdT | null;
};

const initialState: DatasetStateT = {
  pristine: true,
  loading: false,
  error: null,
  data: [],
  selectedDatasetId: null
};

const saveQuery = (
  state: DatasetStateT,
  action: Record<string, any>
): DatasetStateT => {
  const { query, previouslySelectedDatasetId } = action.payload;

  if (!query || query.length === 0) return state;

  const selectedDataset = state.data.find(
    db => db.id === previouslySelectedDatasetId
  );

  if (!selectedDataset) return state;

  const selectedDatasetIdx = state.data.indexOf(selectedDataset);

  // Save query next to the dataset - so it can be reloaded again
  return {
    ...state,
    data: [
      ...state.data.slice(0, selectedDatasetIdx),
      {
        ...state.data[selectedDatasetIdx],
        query
      },
      ...state.data.slice(selectedDatasetIdx + 1)
    ]
  };
};

const datasets = (
  state: DatasetStateT = initialState,
  action: Record<string, any>
): DatasetStateT => {
  switch (action.type) {
    case LOAD_DATASETS_START:
      return { ...state, loading: true, pristine: false };
    case LOAD_DATASETS_SUCCESS:
      const { data } = action.payload;
      const selectedDatasetId = data && data.length > 0 ? data[0].id : null;

      return { ...state, loading: false, error: null, data, selectedDatasetId };
    case LOAD_DATASETS_ERROR:
      return { ...state, loading: false, error: action.payload.message };
    case SELECT_DATASET:
      return {
        ...state,
        selectedDatasetId: action.payload.id
      };
    case SAVE_QUERY:
      return saveQuery(state, action);
    default:
      return state;
  }
};

export default datasets;
