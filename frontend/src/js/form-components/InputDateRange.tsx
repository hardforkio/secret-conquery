import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";

import T from "i18n-react";
// @ts-ignore
import type { FieldPropsType } from "redux-form";

import {
  formatDateFromState,
  parseDate,
  parseDateToState,
  getDateStringFromShortcut
} from "../common/helpers/dateHelper";
import InfoTooltip from "../tooltip/InfoTooltip";

import Label from "./Label";
import Labeled from "./Labeled";
import BaseInput from "./BaseInput";

const Root = styled("div")`
  text-align: ${//@ts-ignore
  ({ center }) => (center ? "center" : "left")};
`;
const Pickers = styled("div")`
  display: flex;
  flex-direction: ${//@ts-ignore
  ({ inline }) => (inline ? "row" : "column")};
  justify-content: ${//@ts-ignore
  ({ center }) => (center ? "center" : "flex-start")};
`;

const StyledLabel = styled(Label)`
  ${//@ts-ignore
  ({ theme, large }) =>
    large &&
    css`
      font-size: ${theme.font.md};
      margin: 20px 0 10px;
    `}
`;

const StyledLabeled = styled(Labeled)`
  &:first-of-type {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

type PropsType = FieldPropsType & {
  // @ts-ignore
  label?: React.Node;
  // @ts-ignore
  labelSuffix?: React.Node;
  className?: string;
  inline?: boolean;
  large?: boolean;
  center?: boolean;
};

// @ts-ignore
function getDisplayDate(what, value, displayDateFormat) {
  if (!value || !value[what]) return "";

  return formatDateFromState(value[what], displayDateFormat);
}

const InputDateRange = (props: PropsType) => {
  // @ts-ignore
  const onSetDate = date => {
    props.input.onChange(date);
  };

  // @ts-ignore
  const onSetWhatDate = (what, value) => {
    props.input.onChange({
      ...props.input.value,
      [what]: value
    });
  };

  // @ts-ignore
  const onChangeRaw = (what, val, dateFormat) => {
    const potentialDate = parseDate(val, dateFormat);

    if (potentialDate) {
      return onSetWhatDate(what, parseDateToState(potentialDate));
    }

    const { min, max } = getDateStringFromShortcut(what, val, dateFormat);

    if (min && max) {
      onSetDate({ min, max });
    } else if (min) {
      onSetWhatDate("min", min);
    } else if (max) {
      onSetWhatDate("max", max);
    } else {
      onSetWhatDate(what, val);
    }
  };

  // @ts-ignore
  const applyDate = (what, val, displayDateFormat) => {
    if (parseDate(val, displayDateFormat) === null) {
      onSetWhatDate(what, "");
    }
  };

  const {
    large,
    inline,
    center,
    label,
    labelSuffix,
    input: { value }
  } = props;

  // To display the date depending on the locale
  const displayDateFormat = T.translate("inputDateRange.dateFormat");

  const min = getDisplayDate("min", value, displayDateFormat);
  const max = getDisplayDate("max", value, displayDateFormat);

  return (
    // @ts-ignore
    <Root center={center}>
      {label && (
        // @ts-ignore
        <StyledLabel large={large}>
          {label}
          <InfoTooltip
            // @ts-ignore
            text={T.translate("inputDateRange.tooltip.possiblePattern")}
          />
          {labelSuffix && labelSuffix}
        </StyledLabel>
      )}
      <Pickers
        // @ts-ignore
        inline={inline}
        center={center}
      >
        <StyledLabeled label={T.translate("inputDateRange.from")}>
          <BaseInput
            inputType="text"
            value={min}
            // @ts-ignore
            placeholder={displayDateFormat.toUpperCase()}
            onChange={value => onChangeRaw("min", value, displayDateFormat)}
            // @ts-ignore
            onBlur={e => applyDate("min", e.target.value, displayDateFormat)}
            // @ts-ignore
            inputProps={{ tabIndex: 1, autoFocus: true }}
          />
        </StyledLabeled>
        <StyledLabeled label={T.translate("inputDateRange.to")}>
          <BaseInput
            inputType="text"
            value={max}
            // @ts-ignore
            placeholder={displayDateFormat.toUpperCase()}
            onChange={value => onChangeRaw("max", value, displayDateFormat)}
            // @ts-ignore
            onBlur={e => applyDate("max", e.target.value, displayDateFormat)}
            // @ts-ignore
            inputProps={{ tabIndex: 2 }}
          />
        </StyledLabeled>
      </Pickers>
    </Root>
  );
};

export default InputDateRange;
