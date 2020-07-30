import React from "react";
import styled from "@emotion/styled";

import { connect } from "react-redux";
import T from "i18n-react";

import type { DateRangeT } from "../api/types";

import { queryGroupModalSetNode } from "../query-group-modal/actions";
import { loadPreviousQuery } from "../previous-queries/list/actions";
import { openQueryUploadConceptListModal } from "../query-upload-concept-list-modal/actions";

import {
  dropAndNode,
  dropOrNode,
  deleteNode,
  deleteGroup,
  toggleExcludeGroup,
  expandPreviousQuery,
  selectNodeForEditing,
  toggleTimestamps
} from "./actions";

import type {
  StandardQueryType,
  DraggedNodeType,
  DraggedQueryType
} from "./types";
import QueryEditorDropzone from "./QueryEditorDropzone";
import QueryGroup from "./QueryGroup";

type PropsT = {
  query: StandardQueryType;
  isEmptyQuery: boolean;
  dropAndNode: (
    node: DraggedNodeType | DraggedQueryType,
    range: DateRangeT | null
  ) => void;
  dropOrNode: (node: DraggedNodeType | DraggedQueryType, idx: number) => void;
  deleteNode: Function;
  deleteGroup: Function;
  dropConceptListFile: Function;
  toggleExcludeGroup: Function;
  expandPreviousQuery: Function;
  loadPreviousQuery: Function;
  selectNodeForEditing: Function;
  queryGroupModalSetNode: Function;
  toggleTimestamps: Function;
  dateRange: Record<string, any>;
};

const Groups = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0 0 20px;
`;

const QueryGroupConnector = styled("p")`
  padding: 110px 6px 0;
  margin: 0;
  font-size: ${({ theme }) => theme.font.sm};
  color: ${({ theme }) => theme.col.gray};
  text-align: center;
`;

const Query = (props: PropsT) => {
  return (
    <div className="flex-grow-1">
      {props.isEmptyQuery ? (
        <QueryEditorDropzone
          isInitial
          // @ts-ignore
          onDropNode={props.dropAndNode}
          // @ts-ignore
          onDropFile={props.dropConceptListFile}
          // @ts-ignore
          onLoadPreviousQuery={props.loadPreviousQuery}
        />
      ) : (
        <Groups>
          {props.query
            .map((group, andIdx) => [
              <QueryGroup
                key={andIdx}
                group={group}
                andIdx={andIdx}
                // @ts-ignore
                onDropNode={item => props.dropOrNode(item, andIdx)}
                // @ts-ignore
                onDropFile={file => props.dropConceptListFile(file, andIdx)}
                // @ts-ignore
                onDeleteNode={orIdx => props.deleteNode(andIdx, orIdx)}
                // @ts-ignore
                onDeleteGroup={orIdx => props.deleteGroup(andIdx, orIdx)}
                // @ts-ignore
                onEditClick={orIdx => props.selectNodeForEditing(andIdx, orIdx)}
                onExpandClick={props.expandPreviousQuery}
                onExcludeClick={() => props.toggleExcludeGroup(andIdx)}
                onDateClick={() => props.queryGroupModalSetNode(andIdx)}
                onLoadPreviousQuery={props.loadPreviousQuery}
                // @ts-ignore
                onToggleTimestamps={orIdx =>
                  props.toggleTimestamps(andIdx, orIdx)
                }
              />,
              <QueryGroupConnector key={`${andIdx}.and`}>
                {T.translate("common.and")}
              </QueryGroupConnector>
            ])
            .concat(
              // @ts-ignore
              <QueryEditorDropzone
                key={props.query.length + 1}
                isAnd
                onDropNode={item => props.dropAndNode(item, props.dateRange)}
                // @ts-ignore
                onDropFile={props.dropConceptListFile}
                // @ts-ignore
                onLoadPreviousQuery={props.loadPreviousQuery}
              />
            )}
        </Groups>
      )}
    </div>
  );
};

// @ts-ignore
function mapStateToProps(state) {
  return {
    query: state.queryEditor.query,
    isEmptyQuery: state.queryEditor.query.length === 0,

    // only used by other actions
    rootConcepts: state.conceptTrees.trees
  };
}

// @ts-ignore
const mapDispatchToProps = dispatch => ({
  // @ts-ignore
  dropAndNode: (item, dateRange) => dispatch(dropAndNode(item, dateRange)),
  // @ts-ignore
  dropConceptListFile: (file, andIdx) =>
    // @ts-ignore
    dispatch(openQueryUploadConceptListModal(andIdx, file)),
  // @ts-ignore
  dropOrNode: (item, andIdx) => dispatch(dropOrNode(item, andIdx)),
  // @ts-ignore
  deleteNode: (andIdx, orIdx) => dispatch(deleteNode(andIdx, orIdx)),
  // @ts-ignore
  deleteGroup: (andIdx, orIdx) => dispatch(deleteGroup(andIdx, orIdx)),
  // @ts-ignore
  toggleExcludeGroup: andIdx => dispatch(toggleExcludeGroup(andIdx)),
  // @ts-ignore
  toggleTimestamps: (andIdx, orIdx) =>
    dispatch(toggleTimestamps(andIdx, orIdx)),
  // @ts-ignore
  selectNodeForEditing: (andIdx, orIdx) =>
    dispatch(selectNodeForEditing(andIdx, orIdx)),
  // @ts-ignore
  queryGroupModalSetNode: andIdx => dispatch(queryGroupModalSetNode(andIdx)),
  // @ts-ignore
  expandPreviousQuery: (datasetId, rootConcepts, queryId) =>
    dispatch(expandPreviousQuery(datasetId, rootConcepts, queryId)),
  // @ts-ignore
  loadPreviousQuery: (datasetId, queryId) =>
    dispatch(loadPreviousQuery(datasetId, queryId))
});

// @ts-ignore
const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  // @ts-ignore
  loadPreviousQuery: queryId =>
    dispatchProps.loadPreviousQuery(ownProps.selectedDatasetId, queryId),
  // @ts-ignore
  expandPreviousQuery: queryId =>
    dispatchProps.expandPreviousQuery(
      ownProps.selectedDatasetId,
      stateProps.rootConcepts,
      queryId
    )
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Query);
