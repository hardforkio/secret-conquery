import { createActionTypes } from "./actionTypes";

const updateFormFilterProperty = (
  state: Record<string, any>,
  action: Record<string, any>,
  property: Record<string, any>
): Record<string, any> => {
  //@ts-ignore
  const { andIdx, orIdx, filterIdx, tableIdx, fieldName } = action.payload;

  //@ts-ignore
  const fieldContent = state[fieldName];
  const andContent = fieldContent && fieldContent[andIdx];
  const orContent = andContent && andContent[orIdx];
  const tableContent = orContent && orContent[tableIdx];
  const filterContent = tableContent && tableContent[filterIdx];

  return {
    ...state,
    [fieldName]: {
      ...fieldContent,
      [andIdx]: {
        ...andContent,
        [orIdx]: {
          ...orContent,
          [tableIdx]: {
            ...tableContent,
            [filterIdx]: {
              ...filterContent,
              ...property
            }
          }
        }
      }
    }
  };
};

const loadFormFilterSuggestionsStart = (
  state: Record<string, any>,
  action: Record<string, any>
): Record<string, any> => {
  return updateFormFilterProperty(state, action, { isLoading: true });
};

const loadFormFilterSuggestionsSuccess = (
  state: Record<string, any>,
  action: Record<string, any>
): Record<string, any> => {
  //@ts-ignore
  const { andIdx, orIdx, filterIdx, tableIdx, fieldName } = action.payload;
  const previousOptions =
    //@ts-ignore
    (state[fieldName] &&
      //@ts-ignore
      state[fieldName][andIdx] &&
      //@ts-ignore
      state[fieldName][andIdx][orIdx] &&
      //@ts-ignore
      state[fieldName][andIdx][orIdx][tableIdx] &&
      //@ts-ignore
      state[fieldName][andIdx][orIdx][tableIdx][filterIdx] &&
      //@ts-ignore
      state[fieldName][andIdx][orIdx][tableIdx][filterIdx].options) ||
    [];

  return updateFormFilterProperty(state, action, {
    isLoading: false,
    //@ts-ignore
    options: action.payload.suggestions
      // Combine with previous suggestions
      .concat(previousOptions)
      // Remove duplicate items
      .reduce(
        //@ts-ignore
        (options, currentOption) =>
          //@ts-ignore
          options.find(x => x.value === currentOption.value)
            ? options
            : [...options, currentOption],
        []
      )
  });
};

const loadFormFilterSuggestionsError = (
  state: Record<string, any>,
  action: Record<string, any>
): Record<string, any> => {
  return updateFormFilterProperty(state, action, { isLoading: false });
};

// TODO: SPEC THIS OUT!
export type FormSuggestionsStateT = Record<string, any>;

export const createFormSuggestionsReducer = (
  formType: string,
  fieldNames: string[]
) => {
  const reducerHandlers = fieldNames
    .map(fieldName => {
      const actionTypes = createActionTypes(formType, fieldName);

      return {
        [actionTypes.LOAD_FILTER_SUGGESTIONS_START]: loadFormFilterSuggestionsStart,
        [actionTypes.LOAD_FILTER_SUGGESTIONS_SUCCESS]: loadFormFilterSuggestionsSuccess,
        [actionTypes.LOAD_FILTER_SUGGESTIONS_ERROR]: loadFormFilterSuggestionsError
      };
    })
    .reduce((acc, handlers) => ({ ...acc, ...handlers }), {});

  return (
    state: FormSuggestionsStateT = {},
    action: Record<string, any>
  ): FormSuggestionsStateT => {
    //@ts-ignore
    if (reducerHandlers[action.type])
      //@ts-ignore
      return reducerHandlers[action.type](state, action);

    return state;
  };
};
