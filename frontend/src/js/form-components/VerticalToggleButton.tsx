import React from "react";
import styled from "@emotion/styled";

type PropsType = {
  className?: string;
  onToggle: (value: string) => void;
  activeValue: string;
  options: {
    label: string;
    value: string;
  }[];
};

const Btn = styled("p")`
  margin: 0 auto;
`;

export const Option = styled("span")`
  font-size: ${({ theme }) => theme.font.xs};
  display: block;
  padding: 2px 8px;
  cursor: pointer;
  transition: ${({ theme }) =>
    `color ${theme.transitionTime}, background-color ${theme.transitionTime}`};
  color: ${//@ts-ignore
  ({ theme, active }) => (active ? theme.col.black : theme.col.gray)};
  border-left: 1px solid ${({ theme }) => theme.col.blueGray};
  border-right: 1px solid ${({ theme }) => theme.col.blueGray};
  background-color: ${//@ts-ignore
  ({ theme, active }) => (active ? theme.col.blueGrayVeryLight : "white")};

  &:first-of-type {
    margin-left: 0; /* first childs left border does not overlap */
    border-top: 1px solid ${({ theme }) => theme.col.blueGray};
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  &:last-of-type {
    border-bottom: 1px solid ${({ theme }) => theme.col.blueGray};
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }

  &:hover {
    background-color: ${//@ts-ignore
    ({ theme, active }) =>
      active ? theme.col.blueGrayVeryLight : theme.col.grayVeryLight};
  }
`;

const VerticalToggleButton = (props: PropsType) => {
  return (
    <Btn className={props.className}>
      {props.options.map(({ value, label }, i) => (
        <Option
          key={i}
          //@ts-ignore
          active={props.activeValue === value}
          onClick={() => {
            if (value !== props.activeValue) props.onToggle(value);
          }}
        >
          {label}
        </Option>
      ))}
    </Btn>
  );
};

export default VerticalToggleButton;
