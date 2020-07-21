import React from "react";
import styled from "@emotion/styled";

const Root = styled("div")`
  cursor: pointer;
`;

type PropsType = {
  className?: string;
  onDisplayAdditionalInfos: Function;
  onToggleAdditionalInfos: Function;
};

const HoverableBase = (Component: any) =>
  class extends React.Component {
    // @ts-ignore
    props: PropsType;

    render() {
      return (
        <Root
          className={this.props.className}
          // @ts-ignore
          onMouseEnter={this.props.onDisplayAdditionalInfos}
          // @ts-ignore
          onClick={this.props.onToggleAdditionalInfos}
        >
          <Component {...this.props} />
        </Root>
      );
    }
  };

export default HoverableBase;
