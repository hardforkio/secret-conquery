import React from "react";
// @ts-ignore
import type { FieldPropsType } from "redux-form";

import type { SelectOptionsT } from "../api/types";
import InputMultiSelect from "./InputMultiSelect";

type PropsType = FieldPropsType & {
  label: string;
  isLoading: boolean;
  options: SelectOptionsT;
  disabled?: boolean | null;
  startLoadingThreshold: number;
  tooltip?: string;
  onLoad: Function;
  onDropFile: Function;
  allowDropFile?: boolean | null;
};

const AsyncInputMultiSelect = ({
  startLoadingThreshold,
  onLoad,
  ...props
}: PropsType) => (
  <InputMultiSelect
    {...props}
    // @ts-ignore
    onInputChange={value => {
      if (value.length >= startLoadingThreshold) onLoad(value);

      return value;
    }}
  />
);

export default AsyncInputMultiSelect;
