import React from "react";
import { findDOMNode } from "react-dom";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import T from "i18n-react";
import { DragSource } from "react-dnd";
import { connect } from "react-redux";
import { parseISO } from "date-fns";

import ErrorMessage from "../../error-message/ErrorMessage";
import * as dndTypes from "../../common/constants/dndTypes";
import { isEmpty } from "../../common/helpers/commonHelper";

import DownloadButton from "../../button/DownloadButton";
import IconButton from "../../button/IconButton";
import FaIcon from "../../icon/FaIcon";
import WithTooltip from "../../tooltip/WithTooltip";

import EditableTags from "../../form-components/EditableTags";

import { deletePreviousQueryModalOpen } from "../delete-modal/actions";
import { canDownloadResult } from "../../user/selectors";

import type { DraggedQueryType } from "../../standard-query-editor/types";

import {
  toggleSharePreviousQuery,
  renamePreviousQuery,
  retagPreviousQuery,
  toggleEditPreviousQueryLabel,
  toggleEditPreviousQueryTags
} from "./actions";

import PreviousQueryTags from "./PreviousQueryTags";
import { formatDateDistance } from "../../common/helpers";
import { PreviousQueryT } from "./reducer";
import PreviousQueriesLabel from "./PreviousQueriesLabel";

const nodeSource = {
  //@ts-ignore
  beginDrag(props, monitor, component): DraggedQueryType {
    //@ts-ignore
    const { width, height } = findDOMNode(component).getBoundingClientRect();
    // Return the data describing the dragged item
    return {
      //@ts-ignore
      width,
      height,
      id: props.query.id,
      label: props.query.label,
      isPreviousQuery: true
    };
  }
};

// These props get injected into the component
//@ts-ignore
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const Root = styled("div")`
  margin: 0;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.col.grayLight};
  background-color: ${({ theme }) => theme.col.bg};
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);

  border-left: ${//@ts-ignore
  ({ theme, own, system }) =>
    own
      ? `4px solid ${theme.col.orange}`
      : system
      ? `4px solid ${theme.col.blueGrayDark}`
      : `1px solid ${theme.col.grayLight}`};

  &:hover {
    ${//@ts-ignore
    ({ theme, own, system }) =>
      !own &&
      !system &&
      css`
        border-left-color: ${theme.col.blueGray};
      `};
    border-top-color: ${({ theme }) => theme.col.blueGray};
    border-right-color: ${({ theme }) => theme.col.blueGray};
    border-bottom-color: ${({ theme }) => theme.col.blueGray};
  }
`;

const Gray = styled("div")`
  color: ${({ theme }) => theme.col.gray};
`;
const TopInfos = styled(Gray)`
  line-height: 24px;
`;

const TopRight = styled("div")`
  float: right;
`;
const SharedIndicator = styled("span")`
  margin-left: 10px;
  color: ${({ theme }) => theme.col.blueGray};
`;
const MiddleRow = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  line-height: 24px;
`;
const StyledErrorMessage = styled(ErrorMessage)`
  margin: 0;
`;

const StyledFaIcon = styled(FaIcon)`
  margin: 0 6px;
`;

const StyledWithTooltip = styled(WithTooltip)`
  margin-left: 10px;
`;

type PropsType = {
  userCanDownloadResults: boolean;
  query: PreviousQueryT;
  onRenamePreviousQuery: () => void;
  onToggleEditPreviousQueryLabel: () => void;
  onToggleEditPreviousQueryTags: () => void;
  onToggleSharePreviousQuery: () => void;
  onRetagPreviousQuery: () => void;
  onDeletePreviousQuery: () => void;
  connectDragSource: () => void;
  availableTags: string[];
};

// Has to be a class because of https://github.com/react-dnd/react-dnd/issues/530
class PreviousQuery extends React.Component {
  //@ts-ignore
  props: PropsType;

  render() {
    const {
      query,
      connectDragSource,
      availableTags,
      onRenamePreviousQuery,
      onDeletePreviousQuery,
      onToggleEditPreviousQueryTags,
      onToggleEditPreviousQueryLabel,
      onRetagPreviousQuery,
      onToggleSharePreviousQuery,
      userCanDownloadResults
    } = this.props;

    const peopleFound = isEmpty(query.numberOfResults)
      ? T.translate("previousQuery.notExecuted")
      : `${query.numberOfResults} ${T.translate("previousQueries.results")}`;
    const executedAt = formatDateDistance(
      parseISO(query.createdAt),
      new Date(),
      true
    );
    const label = query.label || query.id.toString();
    const mayEditQuery = query.own || query.shared;
    //@ts-ignore
    const isNotEditing = !(query.editingLabel || query.editingTags);

    return (
      <Root
        ref={instance => {
          //@ts-ignore
          if (isNotEditing) connectDragSource(instance);
        }}
        //@ts-ignore
        own={!!query.own}
        shared={!!query.shared}
        //@ts-ignore
        system={!!query.system || (!query.own && !query.shared)}
      >
        <TopInfos>
          <div>
            {
              //@ts-ignore
              !!query.resultUrl && userCanDownloadResults ? (
                <WithTooltip
                  text={T.translate("previousQuery.downloadResults")}
                >
                  <DownloadButton
                    //@ts-ignore
                    tight
                    bare
                    //@ts-ignore
                    url={query.resultUrl}
                  >
                    {peopleFound}
                  </DownloadButton>
                </WithTooltip>
              ) : (
                peopleFound
              )
            }
            {query.own && query.shared && (
              <SharedIndicator
                //@ts-ignore
                onClick={() => onToggleSharePreviousQuery(!query.shared)}
              >
                {T.translate("common.shared")}
              </SharedIndicator>
            )}
            <TopRight>
              {executedAt}
              {mayEditQuery &&
                //@ts-ignore
                !query.editingTags &&
                (!query.tags || query.tags.length === 0) && (
                  <StyledWithTooltip text={T.translate("common.addTag")}>
                    <IconButton
                      icon="tags"
                      bare
                      onClick={onToggleEditPreviousQueryTags}
                    />
                  </StyledWithTooltip>
                )}
              {query.own && !query.shared && (
                <StyledWithTooltip text={T.translate("common.share")}>
                  <IconButton
                    icon="upload"
                    bare
                    //@ts-ignore
                    onClick={() => onToggleSharePreviousQuery(!query.shared)}
                  />
                </StyledWithTooltip>
              )}
              {query.loading ? (
                <StyledFaIcon icon="spinner" />
              ) : (
                query.own && (
                  <StyledWithTooltip text={T.translate("common.delete")}>
                    <IconButton
                      icon="times"
                      bare
                      onClick={onDeletePreviousQuery}
                    />
                  </StyledWithTooltip>
                )
              )}
            </TopRight>
          </div>
        </TopInfos>
        <MiddleRow>
          <PreviousQueriesLabel
            mayEditQuery={mayEditQuery}
            loading={!!query.loading}
            label={label}
            selectTextOnMount={true}
            //@ts-ignore
            editing={!!query.editingLabel}
            onSubmit={onRenamePreviousQuery}
            onToggleEdit={onToggleEditPreviousQueryLabel}
          />
          <Gray>
            {
              //@ts-ignore
              query.ownerName
            }
          </Gray>
        </MiddleRow>
        {mayEditQuery ? (
          <EditableTags
            tags={query.tags}
            //@ts-ignore
            editing={!!query.editingTags}
            loading={!!query.loading}
            onSubmit={onRetagPreviousQuery}
            onToggleEdit={onToggleEditPreviousQueryTags}
            tagComponent={<PreviousQueryTags tags={query.tags} />}
            availableTags={availableTags}
          />
        ) : (
          <PreviousQueryTags tags={query.tags} />
        )}
        {!!query.error && <StyledErrorMessage message={query.error} />}
      </Root>
    );
  }
}

//@ts-ignore
const mapStateToProps = state => ({
  availableTags: state.previousQueries.tags,
  userCanDownloadResults: canDownloadResult(state)
});

//@ts-ignore
const mapDispatchToProps = dispatch => ({
  //@ts-ignore
  onToggleSharePreviousQuery: (datasetId, queryId, shared) =>
    dispatch(toggleSharePreviousQuery(datasetId, queryId, shared)),

  //@ts-ignore
  onRenamePreviousQuery: (datasetId, queryId, label) =>
    dispatch(renamePreviousQuery(datasetId, queryId, label)),

  //@ts-ignore
  onRetagPreviousQuery: (datasetId, queryId, tags) =>
    dispatch(retagPreviousQuery(datasetId, queryId, tags)),

  //@ts-ignore
  onDeletePreviousQuery: queryId =>
    dispatch(deletePreviousQueryModalOpen(queryId)),

  //@ts-ignore
  onToggleEditPreviousQueryLabel: queryId =>
    dispatch(toggleEditPreviousQueryLabel(queryId)),

  //@ts-ignore
  onToggleEditPreviousQueryTags: queryId =>
    dispatch(toggleEditPreviousQueryTags(queryId))
});

//@ts-ignore
const mapProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  //@ts-ignore
  onToggleSharePreviousQuery: shared =>
    dispatchProps.onToggleSharePreviousQuery(
      ownProps.datasetId,
      ownProps.query.id,
      shared
    ),
  //@ts-ignore
  onRenamePreviousQuery: label =>
    dispatchProps.onRenamePreviousQuery(
      ownProps.datasetId,
      ownProps.query.id,
      label
    ),
  //@ts-ignore
  onRetagPreviousQuery: tags =>
    dispatchProps.onRetagPreviousQuery(
      ownProps.datasetId,
      ownProps.query.id,
      tags
    ),
  onDeletePreviousQuery: () =>
    dispatchProps.onDeletePreviousQuery(ownProps.query.id),
  onToggleEditPreviousQueryLabel: () =>
    dispatchProps.onToggleEditPreviousQueryLabel(ownProps.query.id),
  onToggleEditPreviousQueryTags: () =>
    dispatchProps.onToggleEditPreviousQueryTags(ownProps.query.id)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mapProps
)(DragSource(dndTypes.PREVIOUS_QUERY, nodeSource, collect)(PreviousQuery));
