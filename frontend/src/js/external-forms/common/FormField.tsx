import React from "react";
import styled from "@emotion/styled";

const TheFormField = styled("div")`
  margin: 0 0 10px;
`;

//@ts-ignore
export default Component => props => (
  <TheFormField>
    <Component {...props} />
  </TheFormField>
);
