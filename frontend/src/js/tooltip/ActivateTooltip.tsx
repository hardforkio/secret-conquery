import React from "react";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import IconButton from "../button/IconButton";
import { toggleDisplayTooltip } from "./actions";

type PropsType = {
  toggleDisplayTooltip: () => void;
};

const Root = styled("div")`
  position: relative;
  height: 100%;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 58px;
  right: 0;
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
`;

const ActivateTooltip = (props: PropsType) => {
  return (
    <Root>
      <StyledIconButton
        //@ts-ignore
        small
        frame
        icon="angle-right"
        onClick={props.toggleDisplayTooltip}
      />
    </Root>
  );
};

//@ts-ignore
const mapDispatchToProps = dispatch => ({
  toggleDisplayTooltip: () => dispatch(toggleDisplayTooltip())
});

export default connect(() => ({}), mapDispatchToProps)(ActivateTooltip);
