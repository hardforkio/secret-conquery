import React from "react";
import styled from "@emotion/styled";

import IconButton from "../button/IconButton";
import FaIcon from "../icon/FaIcon";

import { tableHasActiveFilters, tableIsDisabled } from "../model/table";
// @ts-ignore
import type { TableWithFilterValueType } from "../standard-query-node-editor/types";

import MenuColumnButton from "./MenuColumnButton";

const SxIconButton = styled(IconButton)`
  font-size: ${({ theme }) => theme.font.lg};
  line-height: ${({ theme }) => theme.font.lg};
  padding: 0;

  svg {
    font-size: ${({ theme }) => theme.font.lg};
    line-height: ${({ theme }) => theme.font.lg};
  }
`;
const SxFaIcon = styled(FaIcon)`
  font-size: ${({ theme }) => theme.font.lg};
  line-height: ${({ theme }) => theme.font.lg};
`;

const Label = styled("span")`
  padding-left: 10px;
  line-height: ${({ theme }) => theme.font.lg};
`;

type PropsT = {
  table: TableWithFilterValueType;
  isActive: boolean;
  isOnlyOneTableIncluded: boolean;
  blacklistedTables?: string[];
  whitelistedTables?: string[];
  onClick: () => void;
  onToggleTable: (value: boolean) => void;
};

export default ({
  table,
  isActive,
  isOnlyOneTableIncluded,
  blacklistedTables,
  whitelistedTables,
  onClick,
  onToggleTable
}: PropsT) => {
  const isDisabled = tableIsDisabled(
    table,
    blacklistedTables,
    whitelistedTables
  );

  // TODO: This creates an invalid DOM nesting, a <button> inside a <button>
  //       Yet, this is the way we can get it to work in IE11
  //       => Try to use a clickable div and a nested button instead
  return (
    // @ts-ignore
    <MenuColumnButton active={isActive} disabled={isDisabled} onClick={onClick}>
      <SxIconButton
        regular
        icon={table.exclude ? "square" : "check-square"}
        disabled={isDisabled || (!table.exclude && isOnlyOneTableIncluded)}
        // @ts-ignore
        onClick={event => {
          // To prevent selecting the table as well, see above
          event.stopPropagation();

          if (!isDisabled && (table.exclude || !isOnlyOneTableIncluded))
            onToggleTable(!table.exclude);
        }}
      />
      <Label>{table.label}</Label>
      {tableHasActiveFilters(table) && (
        <SxFaIcon right white={isActive} light={!isActive} icon="filter" />
      )}
    </MenuColumnButton>
  );
};
