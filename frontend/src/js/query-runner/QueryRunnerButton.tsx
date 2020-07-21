import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

import BasicButton from "../button/BasicButton";
import FaIcon from "../icon/FaIcon";

type PropsType = {
  isStartStopLoading: boolean;
  isQueryRunning: boolean;
  disabled: boolean;
  onClick: Function;
};

const Left = styled("span")`
  transition: ${({ theme }) =>
    `color ${theme.transitionTime}, background-color ${theme.transitionTime}`};
  padding: 0 15px;
  background-color: ${//@ts-ignore
  ({ theme, running }) => (running ? "white" : theme.col.blueGrayDark)};
  border-right: ${//@ts-ignore
  ({ theme, running }) =>
    running ? `1px solid ${theme.col.blueGrayDark}` : "transparent"};
`;

const Label = styled("span")`
  transition: background-color ${({ theme }) => theme.transitionTime};
  padding: 0 15px;
  color: ${({ theme }) => theme.col.black};
  background-color: white;
  line-height: 2.5;
  white-space: nowrap;
`;

const StyledBasicButton = styled(BasicButton)`
  outline: none;
  border: 1px solid ${({ theme }) => theme.col.blueGrayDark};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-size: ${({ theme }) => theme.font.sm};
  line-height: 2.5;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  &:hover {
    ${Label} {
      background-color: ${({ theme }) => theme.col.grayVeryLight};
    }
  }
`;

//@ts-ignore
function getIcon(loading, running) {
  return loading ? "spinner" : running ? "stop" : "play";
}

// A button that is prefixed by an icon
const QueryRunnerButton = ({
  onClick,
  isStartStopLoading,
  isQueryRunning,
  disabled
}: PropsType) => {
  const label = isQueryRunning
    ? T.translate("queryRunner.stop")
    : T.translate("queryRunner.start");

  const icon = getIcon(isStartStopLoading, isQueryRunning);

  return (
    //@ts-ignore
    <StyledBasicButton type="button" onClick={onClick} disabled={disabled}>
      <Left
        //@ts-ignore
        running={isQueryRunning}
      >
        <FaIcon white={!isQueryRunning} icon={icon} />
      </Left>
      <Label>{label}</Label>
    </StyledBasicButton>
  );
};

export default QueryRunnerButton;
