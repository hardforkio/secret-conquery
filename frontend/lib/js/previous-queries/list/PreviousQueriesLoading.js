// @flow

import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

const Loading = styled("p")`
  margin: 2px 10px;
`;
const Spinner = styled("span")`
  margin-right: 5px;
`;

export default () => (
  <Loading>
    <Spinner>
      <i className="fa fa-spinner" />
    </Spinner>
    <span>{T.translate("previousQueries.loading")}</span>
  </Loading>
);
