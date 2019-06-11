// @flow

import * as React from "react";
import NumberFormat from "react-number-format";

import { isEmpty } from "../common/helpers";
import type { CurrencyConfigType } from "../common/types/backend";

type PropsType = {
  value: ?number,
  onChange: (?number) => void,
  currencyConfig?: CurrencyConfigType,
  placeholder?: string
};

// https://github.com/s-yadav/react-number-format#values-object
type NumberFormatValueType = {
  formattedValue: string,
  value: string,
  floatValue: number
};

const CurrencyInput = ({
  currencyConfig,
  value,
  onChange,
  placeholder
}: PropsType) => {
  // Super weird: In react-number-format,
  //   in order to properly display the placeholder, "-", the only way is to
  //   NOT supply isNumberString
  //   and instead to supply EITHER a float value OR an empty string
  const [formattedValue, setFormattedValue] = React.useState<number | string>(
    ""
  );
  const factor = currencyConfig ? Math.pow(10, currencyConfig.decimalScale) : 1;

  React.useEffect(() => {
    // Initialize formatted from props
    setFormattedValue(isEmpty(value) ? "" : value / factor);
  }, []);

  React.useEffect(() => {
    // If formatted is cleared from outside, reset
    if (isEmpty(value)) {
      setFormattedValue("");
    }
  }, [value]);

  function onValueChange(values: NumberFormatValueType) {
    const parsed =
      isEmpty(values.floatValue) || isNaN(values.floatValue)
        ? null
        : parseInt((values.floatValue * factor).toFixed(0), 10);

    setFormattedValue(values.formattedValue);

    onChange(parsed);
  }

  return (
    <NumberFormat
      {...currencyConfig}
      className="clearable-input__input"
      placeholder={placeholder}
      type="text"
      onValueChange={onValueChange}
      value={formattedValue}
    />
  );
};

export default CurrencyInput;
