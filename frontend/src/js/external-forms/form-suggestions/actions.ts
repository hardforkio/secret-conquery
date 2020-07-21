//@ts-ignore
import type { Dispatch } from "redux-thunk";

import { createActionTypes } from "./actionTypes";

import api from "../../api";

export const createFormSuggestionActions = (
  formType: string,
  fieldName: string
): Record<string, any> => {
  const actionTypes = createActionTypes(formType, fieldName);

  const loadFormFilterSuggestionsStart = (
    //@ts-ignore
    formName,
    //@ts-ignore
    fieldName,
    //@ts-ignore
    andIdx,
    //@ts-ignore
    orIdx,
    //@ts-ignore
    tableIdx,
    //@ts-ignore
    conceptId,
    //@ts-ignore
    filterIdx,
    //@ts-ignore
    prefix
  ) => ({
    type: actionTypes.LOAD_FILTER_SUGGESTIONS_START,
    payload: {
      formName,
      fieldName,
      andIdx,
      orIdx,
      tableIdx,
      conceptId,
      filterIdx,
      prefix
    }
  });

  const loadFormFilterSuggestionsSuccess = (
    //@ts-ignore
    suggestions,
    //@ts-ignore
    formName,
    //@ts-ignore
    fieldName,
    //@ts-ignore
    andIdx,
    //@ts-ignore
    orIdx,
    //@ts-ignore
    tableIdx,
    //@ts-ignore
    filterIdx
    //@ts-ignore
  ) => ({
    type: actionTypes.LOAD_FILTER_SUGGESTIONS_SUCCESS,
    payload: {
      suggestions,
      formName,
      fieldName,
      andIdx,
      orIdx,
      tableIdx,
      filterIdx
    }
  });

  const loadFormFilterSuggestionsError = (
    //@ts-ignore
    error,
    //@ts-ignore
    formName,
    //@ts-ignore
    fieldName,
    //@ts-ignore
    andIdx,
    //@ts-ignore
    orIdx,
    //@ts-ignore
    tableIdx,
    //@ts-ignore
    filterIdx
    //@ts-ignore
  ) => ({
    type: actionTypes.LOAD_FILTER_SUGGESTIONS_ERROR,
    payload: {
      ...error,
      formName,
      fieldName,
      andIdx,
      orIdx,
      tableIdx,
      filterIdx
    }
  });

  const loadFormFilterSuggestions = (
    //@ts-ignore
    formName,
    //@ts-ignore
    fieldName,
    //@ts-ignore
    datasetId,
    //@ts-ignore
    conceptId,
    //@ts-ignore
    tableId,
    //@ts-ignore
    filterId,
    //@ts-ignore
    prefix,
    //@ts-ignore
    tableIdx,
    //@ts-ignore
    filterIdx,
    //@ts-ignore
    andIdx,
    //@ts-ignore
    orIdx
  ) => {
    return (dispatch: Dispatch) => {
      dispatch(
        loadFormFilterSuggestionsStart(
          formName,
          fieldName,
          andIdx,
          orIdx,
          tableIdx,
          conceptId,
          filterIdx,
          prefix
        )
      );

      return api
        .postPrefixForSuggestions(
          datasetId,
          conceptId,
          tableId,
          filterId,
          prefix
        )
        .then(
          r =>
            dispatch(
              loadFormFilterSuggestionsSuccess(
                r,
                formName,
                fieldName,
                andIdx,
                orIdx,
                tableIdx,
                filterIdx
              )
            ),
          e =>
            dispatch(
              loadFormFilterSuggestionsError(
                e,
                formName,
                fieldName,
                andIdx,
                orIdx,
                tableIdx,
                filterIdx
              )
            )
        );
    };
  };

  return {
    loadFormFilterSuggestions
  };
};
