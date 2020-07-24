// This file specifies
// - response type provided by the backend API
// - partial types that the reponses are built from

import type { Forms } from "./form-types";
import type { FormConfigT } from "js/external-forms/form-configs/reducer";

export type DatasetIdT = string;
export type DatasetT = {
  id: DatasetIdT;
  label: string;
};

export type SelectOptionT = {
  label: string;
  value: number | string;
};

export type SelectOptionsT = SelectOptionT[];

// Example: { min: "2019-01-01", max: "2019-12-31" }
// @ts-ignore
export type DateRangeT = { min: string; max: string };

export interface CurrencyConfigT {
  prefix: string;
  thousandSeparator: string;
  decimalSeparator: string;
  decimalScale: number;
}

export type FilterIdT = string;
export interface FilterBaseT {
  id: FilterIdT;
  label: string;
  description?: string;
}

export interface RangeFilterValueT {
  min?: number;
  max?: number;
  exact?: number;
}
export interface RangeFilterT extends FilterBaseT {
  type: "INTEGER_RANGE" | "REAL_RANGE" | "MONEY_RANGE";
  value: RangeFilterValueT | null;
  unit?: string;
  mode: "range" | "exact";
  precision?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export type MultiSelectFilterValueT = (string | number)[];
export interface MultiSelectFilterBaseT extends FilterBaseT {
  unit?: string;
  options: SelectOptionsT;
  defaultValue: MultiSelectFilterValueT | null;
}

export interface MultiSelectFilterT extends MultiSelectFilterBaseT {
  type: "MULTI_SELECT";
}

export interface BigMultiSelectFilterT extends MultiSelectFilterBaseT {
  type: "BIG_MULTI_SELECT";
  allowDropFile: boolean;
  // Not needed in this format:
  template: {
    filePath: string; // "/.../import/stable/Referenzen/example.csv",
    columns: string[];
    columnValue: string; // Unclear, what that's even needed for
    value: string;
    optionValue: string;
  };
}

export type SelectFilterValueT = string | number;
export interface SelectFilterT extends FilterBaseT {
  type: "SELECT";
  unit?: string;
  options: SelectOptionsT;
  defaultValue: SelectFilterValueT | null;
}

export type StringFilterValueT = string;
export interface StringFilterT extends FilterBaseT {
  type: "STRING";
}

export interface DateColumnT {
  options: SelectOptionsT;
  defaultValue: string | null;
  value?: string;
}

export type FilterT =
  | StringFilterT
  | SelectFilterT
  | MultiSelectFilterT
  | RangeFilterT;

export type TableIdT = string;
export interface TableT {
  id: TableIdT;
  dateColumn: DateColumnT | null;
  connectorId: string; // TODO: Get rid of two ids here (unclear when which one should be used)
  label: string;
  exclude?: boolean;
  filters?: FilterT[]; // Empty array: key not defined
  selects?: SelectorT[]; // Empty array: key not defined
}

export type SelectorIdT = string;
export interface SelectorT {
  id: SelectorIdT;
  label: string;
  description: string;
  default?: boolean;
}

export interface InfoT {
  key: string;
  value: string;
}

export type ConceptIdT = string;

export interface ConceptBaseT {
  label: string;
  active: boolean;
  detailsAvailable: boolean;
  codeListResolvable: boolean;
  matchingEntries: number; // TODO: Don't send with struct nodes (even sent with 0)
  children?: ConceptIdT[]; // Might be an empty struct or a "virtual node"
  description?: string; // Empty array: key not defined
  additionalInfos?: InfoT[]; // Empty array: key not defined
  dateRange?: DateRangeT;
}

export type ConceptStructT = ConceptBaseT;

export interface ConceptElementT extends ConceptBaseT {
  parent?: ConceptIdT; // If not set, it's nested under a struct node
  tables?: TableT[]; // Empty array: key not defined
  selects?: SelectorT[]; // Empty array: key not defined
}

export type ConceptT = ConceptElementT | ConceptStructT;

export interface FilterConfigT {
  filter: FilterIdT; // TODO: Rename this: "id"
  type: // TODO: NOT USED, the type is clear based on the filter id
  | "INTEGER_RANGE"
    | "REAL_RANGE"
    | "MONEY_RANGE"
    | "STRING"
    | "SELECT"
    | "MULTI_SELECT"
    | "BIG_MULTI_SELECT";
  value:
    | StringFilterValueT
    | RangeFilterValueT
    | SelectFilterValueT
    | MultiSelectFilterValueT;
}

export interface TableConfigT {
  id: TableIdT;
  filters?: FilterConfigT;
}

export interface QueryConceptT {
  type: "CONCEPT";
  ids: ConceptIdT[];
  label: string; // Used to expand
  excludeFromTimestampAggregation: boolean; // TODO: Not used
  tables: TableConfigT[];
  selects?: SelectorIdT[];
}

export type QueryIdT = string;
export interface SavedQueryT {
  type: "SAVED_QUERY";
  query: QueryIdT; // TODO: rename this "id"
}

export interface OrQueryT {
  type: "OR";
  children: (QueryConceptT | SavedQueryT)[];
}

export interface DateRestrictionQueryT {
  type: "DATE_RESTRICTION";
  dateRange: DateRangeT;
  child: OrQueryT;
}

export interface NegationQueryT {
  type: "NEGATION";
  child: DateRestrictionQueryT | OrQueryT;
}

export interface AndQueryT {
  type: "AND";
  children: (DateRestrictionQueryT | NegationQueryT | OrQueryT)[];
}

export interface QueryT {
  type: "CONCEPT_QUERY";
  root: AndQueryT | NegationQueryT | DateRestrictionQueryT;
}

// ---------------------------------------
// ---------------------------------------
// API RESPONSES
// ---------------------------------------
// ---------------------------------------
export type GetDatasetsResponseT = DatasetT[];

export interface GetFrontendConfigResponseT {
  currency: CurrencyConfigT;
  version: string;
}

export type GetConceptResponseT = Record<ConceptIdT, ConceptElementT>;

export interface GetConceptsResponseT {
  concepts: {
    // @ts-ignore
    [key: ConceptIdT]: ConceptStructT | ConceptElementT;
  };
  version?: number; // TODO: Is this even sent anymore?
}

// TODO: This actually returns GETStoredQueryResponseT => a lot of unused fields
export interface PostQueriesResponseT {
  id: QueryIdT;
}

// TODO: This actually returns GETStoredQueryResponseT => a lot of unused fields
export interface GetQueryResponseDoneT {
  status: "DONE";
  numberOfResults: number;
  resultUrl: string;
}

export type GetQueryResponseT =
  | GetQueryResponseDoneT
  | {
      status: "FAILED" | "CANCELED";
    };

export interface GetStoredQueryResponseT {
  id: QueryIdT;
  label: string;
  createdAt: string; // ISO timestamp: 2019-06-18T11:11:50.528626+02:00
  own: boolean;
  shared: boolean;
  system: boolean;
  ownerName: string;
  numberOfResults: number;
  resultUrl: string;
  requiredTime: number; // TODO: Not used
  tags?: string[];
  query: QueryT; // TODO: Remove in QUERIES response. Creates a lot of additional traffic right now
  owner: string; // TODO: Remove. Not used. And it's actually an ID
  status: "DONE"; // TODO: Remove. Not used here
}

// TODO: This actually returns a lot of unused fields, see above
export type GetStoredQueriesResponseT = GetStoredQueryResponseT[];

export interface PostConceptResolveResponseT {
  resolvedConcepts?: string[];
  unknownCodes?: string[]; // TODO: Use "unknownConcepts"
}

export interface PostFilterResolveResponseT {
  unknownCodes?: string[];
  resolvedFilter?: {
    filterId: FilterIdT;
    tableId: TableIdT;
    value: {
      label: string;
      value: string;
    }[];
  };
}

interface FilterSuggestion {
  label: string;
  value: string;
  optionValue: string | null;
  templateValues: string[]; // unclear whether that's correct
}
export type PostFilterSuggestionsResponseT = FilterSuggestion[];

export type GetFormQueriesResponseT = Forms;

export interface Permission {
  domains: string[];
  abilities: string[];
  targets: string[];
}

export interface UserGroup {
  groupId: string;
  label: string;
}

export interface GetMeResponseT {
  userName: string;
  permissions: Permission[];
  groups: UserGroup[];
}

export interface PostLoginResponseT {
  access_token: string;
}

export interface PostFormConfigsResponseT {
  id: string;
}

export type GetFormConfigsResponseT = FormConfigT[];

export type GetFormConfigResponseT = FormConfigT;
