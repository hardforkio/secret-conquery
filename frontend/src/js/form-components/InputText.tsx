import React from "react";
// @ts-ignore
import type { FieldPropsType } from "redux-form";

import { isEmpty } from "../common/helpers";

import BaseInput from "./BaseInput";
import Labeled from "./Labeled";

import type { CurrencyConfigT } from "../api/types";

interface PropsT extends FieldPropsType {
  label: string;
  inputType?: string;
  valueType?: string;
  className?: string;
  placeholder?: string;
  tinyLabel?: boolean;
  large?: boolean;
  inputProps?: Record<string, any>;
  currencyConfig?: CurrencyConfigT;
  fullWidth?: boolean;
}

const InputText: React.FC<PropsT> = props => {
  return (
    <Labeled
      className={props.className}
      valueChanged={
        // @ts-ignore
        !isEmpty(props.input.value) &&
        // @ts-ignore
        props.input.value !== props.input.defaultValue
      }
      fullWidth={props.fullWidth}
      label={props.label}
      tinyLabel={props.tinyLabel}
      largeLabel={props.large}
    >
      <BaseInput
        large={props.large}
        inputType={props.inputType || "text"}
        valueType={props.valueType}
        placeholder={props.placeholder}
        // @ts-ignore
        value={props.input.value}
        // @ts-ignore
        onChange={props.input.onChange}
        currencyConfig={props.currencyConfig}
        inputProps={props.inputProps}
      />
    </Labeled>
  );
};

export default InputText;
