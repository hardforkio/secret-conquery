import React from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import T from "i18n-react";

import IconButton from "../button/IconButton";

import { clearQuery } from "./actions";

const Root = styled("div")`
  margin-bottom: 20px;
  padding: 0 20px 0 10px;
`;

type PropsType = {
  clearQuery: () => void;
  isVisible: boolean;
};

const QueryClearButton = (props: PropsType) => {
  return (
    props.isVisible && (
      <Root>
        <IconButton frame onClick={props.clearQuery} regular icon="trash-alt">
          {T.translate("common.clear")}
        </IconButton>
      </Root>
    )
  );
};

//@ts-ignore
const mapStateToProps = state => ({
  isVisible: state.queryEditor.query.length !== 0
});

//@ts-ignore
const mapDispatchToProps = dispatch => ({
  clearQuery: () => dispatch(clearQuery())
});

const ConnectedQueryClearButton = connect(
  mapStateToProps,
  mapDispatchToProps
  //@ts-ignore
)(QueryClearButton);
export { ConnectedQueryClearButton as QueryClearButton };
