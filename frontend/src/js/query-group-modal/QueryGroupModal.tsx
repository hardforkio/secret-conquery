import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";
import { connect } from "react-redux";

import InputDateRange from "../form-components/InputDateRange";
import IconButton from "../button/IconButton";
import Modal from "../modal/Modal";

import {
  queryGroupModalClearNode,
  queryGroupModalSetDate,
  queryGroupModalResetAllDates
} from "./actions";

const HeadlinePart = styled("span")`
  padding: 0 5px 0 0;
`;

const Elements = styled("div")`
  display: block;
  margin: 0 0 15px;
  max-width: 450px;
`;

const ResetAll = styled(IconButton)`
  color: ${({ theme }) => theme.col.blueGrayDark};
  font-weight: 700;
  margin-left: 20px;
`;

type PropsType = {
  group: Record<string, any>;
  andIdx: number;
  onClose: () => void;
  onSetDate: (date: any) => void;
  onResetAllDates: () => void;
};

const QueryGroupModal = (props: PropsType) => {
  if (!props.group) return null;

  // @ts-ignore
  const { dateRange } = props.group;

  const minDate = dateRange ? dateRange.min : null;
  const maxDate = dateRange ? dateRange.max : null;
  const hasActiveDate = !!(minDate || maxDate);

  const { onSetDate } = props;

  return (
    <Modal
      onClose={props.onClose}
      doneButton
      tabIndex={3}
      headline={T.translate("queryGroupModal.explanation")}
    >
      <Elements>
        {
          // @ts-ignore
          props.group.elements.reduce(
            // @ts-ignore
            (parts, concept, i, elements) => [
              ...parts,
              <HeadlinePart key={i + "-headline"}>
                {concept.label || concept.id}
              </HeadlinePart>,
              i !== elements.length - 1 ? (
                <span key={i + "-comma"}>, </span>
              ) : (
                ""
              )
            ],
            [
              <HeadlinePart key={-1}>
                {T.translate("queryGroupModal.headlineStart")}
              </HeadlinePart>
            ]
          )
        }
      </Elements>
      <InputDateRange
        large
        inline
        label={T.translate("queryGroupModal.dateRange")}
        labelSuffix={
          <>
            {hasActiveDate && (
              <ResetAll bare onClick={props.onResetAllDates} icon="undo">
                {T.translate("queryNodeEditor.reset")}
              </ResetAll>
            )}
          </>
        }
        input={{
          onChange: onSetDate,
          value: dateRange
        }}
      />
    </Modal>
  );
};

// @ts-ignore
function findGroup(query, andIdx) {
  if (!query[andIdx]) return null;

  return query[andIdx];
}

// @ts-ignore
const mapStateToProps = state => ({
  group: findGroup(state.queryEditor.query, state.queryGroupModal.andIdx),
  andIdx: state.queryGroupModal.andIdx
});

const mapDispatchToProps = (dispatch: any) => ({
  onClose: () => dispatch(queryGroupModalClearNode()),
  // @ts-ignore
  onSetDate: (andIdx, date) => dispatch(queryGroupModalSetDate(andIdx, date)),
  // @ts-ignore
  onResetAllDates: andIdx => dispatch(queryGroupModalResetAllDates(andIdx))
});

// Used to enhance the dispatchProps with the andIdx
// @ts-ignore
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  // @ts-ignore
  onSetDate: date => dispatchProps.onSetDate(stateProps.andIdx, date),
  onResetAllDates: () => dispatchProps.onResetAllDates(stateProps.andIdx)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(QueryGroupModal);
