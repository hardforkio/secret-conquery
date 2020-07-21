import React from "react";

import { createConnectedQueryNodeEditor } from "../query-node-editor/QueryNodeEditor";

// @ts-ignore
import type { StateType } from "../app/reducers";
import type { PropsType } from "../query-node-editor/QueryNodeEditor";

import { tableIsEditable } from "../model/table";

import {
  deselectNode,
  updateNodeLabel,
  addConceptToNode,
  removeConceptFromNode,
  toggleTable,
  setFilterValue,
  switchFilterMode,
  resetAllFilters,
  toggleTimestamps,
  loadFilterSuggestions,
  setSelects,
  setTableSelects,
  setDateColumn
} from "./actions";

// @ts-ignore
const findNodeBeingEdited = query =>
  query
    // @ts-ignore
    .reduce((acc, group) => [...acc, ...group.elements], [])
    // @ts-ignore
    .find(element => element.isEditing);

const mapStateToProps = (state: StateType) => {
  const node = findNodeBeingEdited(state.queryEditor.query);

  const showTables =
    // @ts-ignore
    node && !!node.tables && node.tables.some(table => tableIsEditable(table));

  return {
    node,
    editorState: state.queryNodeEditor,
    showTables,
    isExcludeTimestampsPossible: true,
    currencyConfig: state.startup.config.currency
  };
};

// @ts-ignore
const mapDispatchToProps = dispatch => ({
  onCloseModal: () => dispatch(deselectNode()),
  // @ts-ignore
  onUpdateLabel: label => dispatch(updateNodeLabel(label)),
  // @ts-ignore
  onDropConcept: concept => dispatch(addConceptToNode(concept)),
  // @ts-ignore
  onRemoveConcept: conceptId => dispatch(removeConceptFromNode(conceptId)),
  // @ts-ignore
  onToggleTable: (tableIdx, isExcluded) =>
    dispatch(toggleTable(tableIdx, isExcluded)),
  // @ts-ignore
  onSelectSelects: value => dispatch(setSelects(value)),
  // @ts-ignore
  onSelectTableSelects: (tableIdx, value) =>
    dispatch(setTableSelects(tableIdx, value)),
  // @ts-ignore
  onSetFilterValue: (tableIdx, filterIdx, value) =>
    dispatch(setFilterValue(tableIdx, filterIdx, value)),
  // @ts-ignore
  onSwitchFilterMode: (tableIdx, filterIdx, mode) =>
    dispatch(switchFilterMode(tableIdx, filterIdx, mode)),
  // @ts-ignore
  onResetAllFilters: (andIdx, orIdx) =>
    dispatch(resetAllFilters(andIdx, orIdx)),
  onToggleTimestamps: () => dispatch(toggleTimestamps(null, null)),
  // @ts-ignore
  onLoadFilterSuggestions: (...params) =>
    // @ts-ignore
    dispatch(loadFilterSuggestions(...params)),
  // @ts-ignore
  onSetDateColumn: (tableIdx, value) => dispatch(setDateColumn(tableIdx, value))
});

// @ts-ignore
const QueryNodeEditor = createConnectedQueryNodeEditor(
  mapStateToProps,
  mapDispatchToProps
);

export default (props: PropsType) => (
  // @ts-ignore
  <QueryNodeEditor name="standard" {...props} />
);
