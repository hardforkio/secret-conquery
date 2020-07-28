import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";
import type { TabType } from "./reducer";

const DivWithBottomBorder = styled("div")`
  border-bottom: 1px solid ${({ theme }) => theme.col.grayLight};
`;

const Headline = styled("span")<{ active: boolean }>`
  transition: color ${({ theme }) => theme.transitionTime},
    border-bottom ${({ theme }) => theme.transitionTime};
  color: ${({ theme, active }) =>
    active ? theme.col.blueGrayDark : theme.col.gray};
  border-bottom: 3px solid
    ${({ theme, active }) => (active ? theme.col.blueGrayDark : "transparent")};

  &:hover {
    color: ${({ theme, active }) =>
      active ? theme.col.blueGrayDark : theme.col.black};
    border-bottom: 3px solid
      ${({ theme, active }) =>
        active ? theme.col.blueGrayDark : theme.col.grayLight};
  }
`;

interface PropsT {
  onClickTab: (tab: string) => void;
  activeTab: string;
  tabs: TabType[];
}

const TabNavigation: React.FC<PropsT> = props => {
  return (
    <DivWithBottomBorder className="d-flex bg-white px-2">
      {Object.values(props.tabs).map(({ label, key }) => (
        <a
          className="py-2 text-truncate px-1"
          href="#"
          onClick={event => {
            event.preventDefault();
            if (key !== props.activeTab) props.onClickTab(key);
          }}
        >
          <Headline
            className={"text-uppercase text-center"}
            key={key}
            active={props.activeTab === key}
          >
            {T.translate(label)}
          </Headline>
        </a>
      ))}
    </DivWithBottomBorder>
  );
};

export default TabNavigation;
