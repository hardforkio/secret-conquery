import {
  DISPLAY_ADDITIONAL_INFOS,
  TOGGLE_ADDITIONAL_INFOS
} from "./actionTypes";

export const displayAdditionalInfos = (
  additionalInfos: Record<string, any>
) => ({
  type: DISPLAY_ADDITIONAL_INFOS,
  payload: {
    additionalInfos
  }
});

export const toggleAdditionalInfos = () => ({ type: TOGGLE_ADDITIONAL_INFOS });
