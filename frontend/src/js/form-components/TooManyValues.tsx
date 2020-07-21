import React from "react";
import T from "i18n-react";
import styled from "@emotion/styled";

import IconButton from "../button/IconButton";

const Root = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
`;

const Text = styled("p")`
  margin: 0;
`;

// @ts-ignore
export default ({ value, onClear }) => (
  <Root>
    <Text>
      {T.translate("queryNodeEditor.tooManyValues", { count: value.length })}
    </Text>
    <IconButton
      icon="times"
      // @ts-ignore
      title={T.translate("common.clearValue")}
      // @ts-ignore
      aria-label={T.translate("common.clearValue")}
      onClick={onClear}
    />
  </Root>
);
