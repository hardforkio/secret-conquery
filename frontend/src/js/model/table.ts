import type { TableT } from "../api/types";
import type { TableWithFilterValueType } from "../standard-query-editor/types";

import { isEmpty, compose } from "../common/helpers";

import { objectHasSelectedSelects, selectsWithDefaults } from "./select";
import { filtersWithDefaults } from "./filter";

export const tableIsEditable = (table: TableT) =>
  (!!table.filters && table.filters.length > 0) ||
  (!!table.selects && table.selects.length > 0) ||
  (!!table.dateColumn && table.dateColumn.options.length > 0);

export const tablesHaveActiveFilter = (tables: TableWithFilterValueType[]) =>
  tables.some(table => tableHasActiveFilters(table));

export const tableHasActiveFilters = (table: TableWithFilterValueType) =>
  objectHasSelectedSelects(table) ||
  tableHasNonDefaultDateColumn(table) ||
  (table.filters &&
    table.filters.some(
      // @ts-ignore
      filter => !isEmpty(filter.value) && filter.value !== filter.defaultValue
    ));

const tableHasNonDefaultDateColumn = (table: TableWithFilterValueType) =>
  !!table.dateColumn &&
  !!table.dateColumn.options &&
  table.dateColumn.options.length > 0 &&
  table.dateColumn.value !== table.dateColumn.options[0].value;

export function tableIsDisabled(
  table: TableWithFilterValueType,
  blacklistedTables?: string[],
  whitelistedTables?: string[]
) {
  return (
    (!!whitelistedTables && !tableIsWhitelisted(table, whitelistedTables)) ||
    (!!blacklistedTables && tableIsBlacklisted(table, blacklistedTables))
  );
}

export function tableIsBlacklisted(
  table: TableWithFilterValueType,
  blacklistedTables: string[]
) {
  return blacklistedTables.some(
    tableName => table.id.toLowerCase().indexOf(tableName.toLowerCase()) !== -1
  );
}

export function tableIsWhitelisted(
  table: TableWithFilterValueType,
  whitelistedTables: string[]
) {
  return whitelistedTables.some(
    tableName => table.id.toLowerCase().indexOf(tableName.toLowerCase()) !== -1
  );
}

export const resetAllFiltersInTables = (tables: TableWithFilterValueType[]) => {
  if (!tables) return [];

  return tablesWithDefaults(tables);
};

// @ts-ignore
const tableWithDefaultDateColumn = table => {
  return {
    ...table,
    dateColumn:
      !!table.dateColumn &&
      !!table.dateColumn.options &&
      table.dateColumn.options.length > 0
        ? { ...table.dateColumn, value: table.dateColumn.options[0].value }
        : null
  };
};

// @ts-ignore
const tableWithDefaultFilters = table => ({
  ...table,
  filters: filtersWithDefaults(table.filters)
});

// @ts-ignore
const tableWithDefaultSelects = table => ({
  ...table,
  selects: selectsWithDefaults(table.selects)
});

// @ts-ignore
const tableWithDefaults = table =>
  compose(
    tableWithDefaultDateColumn,
    tableWithDefaultSelects,
    tableWithDefaultFilters
  )({
    ...table,
    exclude: false
  });

// @ts-ignore
export const tablesWithDefaults = tables =>
  tables ? tables.map(tableWithDefaults) : null;
