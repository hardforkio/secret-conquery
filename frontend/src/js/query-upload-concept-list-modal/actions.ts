import {
  initUploadConceptListModal,
  resetUploadConceptListModal
} from "../upload-concept-list-modal/actions";
import { MODAL_OPEN, MODAL_CLOSE, MODAL_ACCEPT } from "./actionTypes";

const openModal = (andIdx = null) => ({
  type: MODAL_OPEN,
  payload: { andIdx }
});

export const openQueryUploadConceptListModal = (
  // @ts-ignore
  andIdx,
  // @ts-ignore
  file
  // @ts-ignore
) => async dispatch => {
  // Need to wait until file is processed.
  // Because if file is empty, modal would close automatically
  await dispatch(initUploadConceptListModal(file));

  return dispatch(openModal(andIdx));
};

const closeModal = () => ({
  type: MODAL_CLOSE
});

// @ts-ignore
export const closeQueryUploadConceptListModal = () => dispatch => {
  return dispatch([closeModal(), resetUploadConceptListModal()]);
};

export const acceptQueryUploadConceptListModal = (
  // @ts-ignore
  andIdx,
  // @ts-ignore
  label,
  // @ts-ignore
  rootConcepts,
  // @ts-ignore
  resolvedConcepts
) => {
  return {
    type: MODAL_ACCEPT,
    payload: { andIdx, label, rootConcepts, resolvedConcepts }
  };
};
