import React from "react";
import styled from "@emotion/styled";

import BasicButton from "./BasicButton";

const TransparentButton = styled(BasicButton)`
  color: ${//@ts-ignore
  ({ theme, light }) => (light ? theme.col.gray : theme.col.black)};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${//@ts-ignore
    ({ theme, light }) => (light ? theme.col.grayLight : theme.col.gray)};

  &:hover {
    background-color: ${({ theme }) => theme.col.grayVeryLight};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.col.green};
    background-color: ${({ theme }) => theme.col.grayVeryLight};
  }
`;
//@ts-ignore

export default props => <TransparentButton {...props} />;
