import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

import TableFilters from "./TableFilters";
import TableSelects from "./TableSelects";
import ContentCell from "./ContentCell";
import DateColumnSelect from "./DateColumnSelect";
import type { PropsType } from "./QueryNodeEditor";

const Column = styled("div")`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const MaximizedCell = styled(ContentCell)`
  flex-grow: 1;
  padding-bottom: 30px;
`;

const TableView = (props: PropsType) => {
  const {
    node,
    editorState,
    datasetId,

    onSelectTableSelects,
    onSetDateColumn,

    onSetFilterValue,
    onSwitchFilterMode,
    onLoadFilterSuggestions
  } = props;

  // @ts-ignore
  const table = node.tables[editorState.selectedInputTableIdx];

  const displaySelects = !!table.selects && table.selects.length > 0;
  const displayDateColumnOptions =
    !!table.dateColumn && table.dateColumn.options.length > 0;
  const displayFilters = !!table.filters && table.filters.length > 0;

  return (
    <Column>
      {displaySelects && (
        // @ts-ignore
        <ContentCell headline={T.translate("queryNodeEditor.selects")}>
          <TableSelects
            selects={table.selects}
            // @ts-ignore
            onSelectTableSelects={value =>
              onSelectTableSelects(editorState.selectedInputTableIdx, value)
            }
          />
        </ContentCell>
      )}
      {displayDateColumnOptions && (
        <ContentCell
          // @ts-ignore
          headline={T.translate("queryNodeEditor.selectValidityDate")}
        >
          <DateColumnSelect
            dateColumn={table.dateColumn}
            onSelectDateColumn={value =>
              onSetDateColumn(editorState.selectedInputTableIdx, value)
            }
          />
        </ContentCell>
      )}
      {displayFilters && (
        // @ts-ignore
        <MaximizedCell headline={T.translate("queryNodeEditor.filters")}>
          <TableFilters
            key={editorState.selectedInputTableIdx}
            filters={table.filters}
            context={{
              // @ts-ignore
              datasetId,
              // @ts-ignore
              treeId: node.tree,
              tableId: table.id
            }}
            // @ts-ignore
            onSetFilterValue={(filterIdx, value) =>
              onSetFilterValue(
                editorState.selectedInputTableIdx,
                filterIdx,
                value
              )
            }
            // @ts-ignore
            onSwitchFilterMode={(filterIdx, mode) =>
              onSwitchFilterMode(
                editorState.selectedInputTableIdx,
                filterIdx,
                mode
              )
            }
            // @ts-ignore
            onLoadFilterSuggestions={(filterIdx, filterId, prefix) =>
              onLoadFilterSuggestions(
                datasetId,
                // @ts-ignore
                node.tree,
                table.id,
                filterId,
                prefix,
                editorState.selectedInputTableIdx,
                filterIdx
              )
            }
            suggestions={
              !!props.suggestions &&
              // @ts-ignore
              props.suggestions[editorState.selectedInputTableIdx]
            }
            onShowDescription={editorState.onShowDescription}
            // @ts-ignore
            currencyConfig={props.currencyConfig}
          />
        </MaximizedCell>
      )}
    </Column>
  );
};

export default TableView;
