import { LOAD_ME_START, LOAD_ME_ERROR, LOAD_ME_SUCCESS } from "./actionTypes";

import type { GetMeResponseT } from "../api/types";

export type UserStateT = {
  loading: boolean;
  error: string | null;
  me: GetMeResponseT | null;
};

const initialState: UserStateT = {
  loading: false,
  error: null,
  me: null
};

const startup = (
  state: UserStateT = initialState,
  action: Record<string, any>
): UserStateT => {
  switch (action.type) {
    case LOAD_ME_START:
      return {
        ...state,
        loading: true
      };
    case LOAD_ME_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message
      };
    case LOAD_ME_SUCCESS:
      return {
        ...state,
        loading: false,
        me: action.payload.data
      };
    default:
      return state;
  }
};

export default startup;
