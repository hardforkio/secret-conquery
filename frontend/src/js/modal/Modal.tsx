import * as React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";
import onClickOutside from "react-onclickoutside";
import Hotkeys from "react-hot-keys";

import FaIcon from "../icon/FaIcon";
import TransparentButton from "../button/TransparentButton";
import WithTooltip from "../tooltip/WithTooltip";

const Root = styled("div")`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
`;

const Content = styled("div")`
  display: inline-block;
  text-align: left;
  cursor: initial;
  background-color: white;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 30px;
  margin: 0 20px;
  position: relative;
`;

const TopRow = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Headline = styled("h3")`
  margin: 0 10px 15px 0;
  font-size: ${({ theme }) => theme.font.md};
  color: ${({ theme }) => theme.col.blueGrayDark};
`;

// https://github.com/Pomax/react-onclickoutside
interface ContentPropsT {
  onClose: () => void;
}

const ModalContentComponent: React.FC<ContentPropsT> = ({
  children,
  onClose
}) => {
  ModalContentComponent.handleClickOutside = onClose;

  return <Content>{children}</Content>;
};

const ModalContent = onClickOutside(ModalContentComponent, {
  handleClickOutside: () => ModalContentComponent.handleClickOutside
});
// -----------------------------------------------

type PropsT = {
  className?: string;
  headline?: React.ReactNode;
  doneButton?: boolean;
  closeIcon?: boolean;
  tabIndex?: number;
  onClose: () => void;
};

// A modal with three ways to close it
// - a button
// - click outside
// - press esc
const Modal: React.FC<PropsT> = ({
  className,
  children,
  headline,
  tabIndex,
  doneButton,
  closeIcon,
  onClose
}) => {
  return (
    <Root className={className}>
      <Hotkeys keyName="escape" onKeyDown={onClose} />
      <ModalContent onClose={onClose}>
        <TopRow>
          <Headline>{headline}</Headline>
          {closeIcon && (
            <WithTooltip text={T.translate("common.closeEsc")}>
              <TransparentButton
                small
                tabIndex={tabIndex || 0}
                onClick={onClose}
              >
                <FaIcon icon="times" />
              </TransparentButton>
            </WithTooltip>
          )}
          {doneButton && (
            <WithTooltip text={T.translate("common.closeEsc")}>
              <TransparentButton
                small
                tabIndex={tabIndex || 0}
                onClick={onClose}
              >
                {T.translate("common.done")}
              </TransparentButton>
            </WithTooltip>
          )}
        </TopRow>
        {children}
      </ModalContent>
    </Root>
  );
};

export default Modal;
