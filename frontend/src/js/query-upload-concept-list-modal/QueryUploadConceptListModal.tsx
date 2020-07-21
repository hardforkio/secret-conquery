import React from "react";
import { connect } from "react-redux";

import UploadConceptListModal from "../upload-concept-list-modal/UploadConceptListModal";

import {
  acceptQueryUploadConceptListModal,
  closeQueryUploadConceptListModal
} from "./actions";

export default connect(
  // @ts-ignore
  state => ({ context: state.queryUploadConceptListModal }),
  dispatch => ({
    // @ts-ignore
    accept: (...params) =>
      // @ts-ignore
      dispatch(acceptQueryUploadConceptListModal(...params)),
    // @ts-ignore
    onClose: () => dispatch(closeQueryUploadConceptListModal())
  })
  // @ts-ignore
)(({ accept, context, ...props }) => {
  // @ts-ignore
  if (!context.isOpen) return null;

  // @ts-ignore
  const onAccept = (label, rootConcepts, resolved) =>
    // @ts-ignore
    accept(context.andIdx, label, rootConcepts, resolved);

  return <UploadConceptListModal {...props} onAccept={onAccept} />;
});
