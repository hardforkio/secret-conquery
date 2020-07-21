import React from "react";
import styled from "@emotion/styled";

import InputSelect from "../form-components/InputSelect";
import InputRange from "../form-components/InputRange";
import InputText from "../form-components/InputText";

import ResolvableMultiSelect from "./ResolvableMultiSelect";

import {
  SELECT,
  MULTI_SELECT,
  INTEGER_RANGE,
  REAL_RANGE,
  MONEY_RANGE,
  STRING,
  BIG_MULTI_SELECT
} from "../form-components/filterTypes";

import type { FilterWithValueType } from "../standard-query-editor/types";

import type {
  CurrencyConfigT,
  DatasetIdT,
  ConceptIdT,
  TableIdT
} from "../api/types";

export type FiltersContextT = {
  datasetId: DatasetIdT;
  treeId: ConceptIdT;
  tableId: TableIdT;
};

type PropsType = {
  context: FiltersContextT;
  filters: FilterWithValueType[] | null;
  className?: string;
  excludeTable: boolean;
  onSwitchFilterMode: Function;
  onSetFilterValue: Function;
  onLoadFilterSuggestions: Function;
  onShowDescription: Function;
  suggestions: Record<string, any> | null;
  currencyConfig: CurrencyConfigT;
};

const Row = styled("div")`
  margin-bottom: 10px;
`;

const TableFilters = (props: PropsType) => {
  if (!props.filters || props.filters.length === 0) return null;

  return (
    <div>
      {props.filters
        .map((filter, filterIdx) => {
          switch (filter.type) {
            case SELECT:
              return (
                <InputSelect
                  input={{
                    clearable: filter.value !== filter.defaultValue,
                    defaultValue: filter.defaultValue,
                    value: filter.value,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  label={filter.label}
                  options={filter.options}
                  disabled={props.excludeTable}
                />
              );
            case MULTI_SELECT:
              return (
                <ResolvableMultiSelect
                  context={{ ...props.context, filterId: filter.id }}
                  input={{
                    value: filter.value,
                    defaultValue: filter.defaultValue,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  label={filter.label}
                  options={filter.options}
                  disabled={props.excludeTable}
                  // @ts-ignore
                  allowDropFile={!!filter.allowDropFile}
                />
              );
            // @ts-ignore
            case BIG_MULTI_SELECT:
              return (
                <ResolvableMultiSelect
                  // @ts-ignore
                  context={{ ...props.context, filterId: filter.id }}
                  input={{
                    // @ts-ignore
                    value: filter.value,
                    // @ts-ignore
                    defaultValue: filter.defaultValue,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  // @ts-ignore
                  label={filter.label}
                  options={
                    // @ts-ignore
                    filter.options ||
                    (props.suggestions &&
                      // @ts-ignore
                      props.suggestions[filterIdx] &&
                      // @ts-ignore
                      props.suggestions[filterIdx].options)
                  }
                  disabled={!!props.excludeTable}
                  // @ts-ignore
                  allowDropFile={!!filter.allowDropFile}
                  isLoading={
                    // @ts-ignore
                    filter.isLoading ||
                    (props.suggestions &&
                      // @ts-ignore
                      props.suggestions[filterIdx] &&
                      // @ts-ignore
                      props.suggestions[filterIdx].isLoading)
                  }
                  // @ts-ignore
                  startLoadingThreshold={filter.threshold || 1}
                  // @ts-ignore
                  onLoad={prefix =>
                    // @ts-ignore
                    props.onLoadFilterSuggestions(filterIdx, filter.id, prefix)
                  }
                />
              );
            case INTEGER_RANGE:
              return (
                <InputRange
                  inputType="number"
                  input={{
                    value: filter.value,
                    // @ts-ignore
                    defaultValue: filter.defaultValue,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  limits={{ min: filter.min, max: filter.max }}
                  unit={filter.unit}
                  label={filter.label}
                  mode={filter.mode || "range"}
                  disabled={!!props.excludeTable}
                  // @ts-ignore
                  onSwitchMode={mode =>
                    props.onSwitchFilterMode(filterIdx, mode)
                  }
                  placeholder="-"
                  pattern={filter.pattern}
                />
              );
            case REAL_RANGE:
              return (
                <InputRange
                  inputType="number"
                  input={{
                    value: filter.value,
                    // @ts-ignore
                    defaultValue: filter.defaultValue,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  limits={{ min: filter.min, max: filter.max }}
                  unit={filter.unit}
                  label={filter.label}
                  mode={filter.mode || "range"}
                  stepSize={filter.precision || 0.1}
                  disabled={!!props.excludeTable}
                  // @ts-ignore
                  onSwitchMode={mode =>
                    props.onSwitchFilterMode(filterIdx, mode)
                  }
                  placeholder="-"
                  pattern={filter.pattern}
                />
              );
            case MONEY_RANGE:
              return (
                <InputRange
                  inputType="text"
                  valueType={MONEY_RANGE}
                  input={{
                    value: filter.value,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  unit={filter.unit}
                  label={filter.label}
                  mode={filter.mode || "range"}
                  disabled={!!props.excludeTable}
                  // @ts-ignore
                  onSwitchMode={mode =>
                    props.onSwitchFilterMode(filterIdx, mode)
                  }
                  placeholder="-"
                  currencyConfig={props.currencyConfig}
                />
              );
            // @ts-ignore
            case STRING:
              return (
                <InputText
                  inputType="text"
                  // @ts-ignore
                  input={{
                    // @ts-ignore
                    value: filter.value || "",
                    // @ts-ignore
                    defaultValue: filter.defaultValue,
                    // @ts-ignore
                    onChange: value => props.onSetFilterValue(filterIdx, value)
                  }}
                  placeholder="-"
                  // @ts-ignore
                  label={filter.label}
                />
              );
            default:
              // In the future, there might be other filter types supported
              return null;
          }
        })
        .filter(input => !!input)
        .map((input, filterIdx) => (
          <Row
            key={filterIdx}
            onFocusCapture={() => props.onShowDescription(filterIdx)}
          >
            {input}
          </Row>
        ))}
    </div>
  );
};

export default TableFilters;
