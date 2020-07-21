// flow

import type { SelectorT } from "../api/types";

// @ts-ignore
export function objectHasSelectedSelects(obj) {
  return (
    obj &&
    obj.selects &&
    obj.selects.some(
      // @ts-ignore
      select =>
        (select.selected && !select.default) ||
        (!select.selected && !!select.default)
    )
  );
}

export function sortSelects(selects: SelectorT[]) {
  return selects
    .concat() // To avoid mutating the original array
    .sort((a, b) => (a.label < b.label ? -1 : 1));
}

// @ts-ignore
const withDefaultSelect = select => ({
  ...select,
  selected: !!select.default
});

// @ts-ignore
export const selectsWithDefaults = selects =>
  selects ? selects.map(withDefaultSelect) : null;
