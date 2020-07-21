import React, { FC } from "react";
import T from "i18n-react";

import styled from "@emotion/styled";
import { useSelector, useDispatch } from "react-redux";
import { StateT } from "app-types";
import { setPreviousQueriesFilter } from "./actions";
import SmallTabNavigation from "../../small-tab-navigation/SmallTabNavigation";

const SxSmallTabNavigation = styled(SmallTabNavigation)`
  margin-bottom: 5px;
  padding: 0 10px;
`;

const PreviousQueriesFilter: FC = () => {
  const OPTIONS = [
    {
      value: "all",
      label: T.translate("previousQueriesFilter.all") as string
    },
    {
      value: "own",
      label: T.translate("previousQueriesFilter.own") as string
    },
    {
      value: "system",
      label: T.translate("previousQueriesFilter.system") as string
    },
    {
      value: "shared",
      label: T.translate("previousQueriesFilter.shared") as string
    }
  ];

  const selectedFilter = useSelector<StateT, string>(
    state => state.previousQueriesFilter
  );
  const dispatch = useDispatch();
  const setFilter = (filter: string) =>
    dispatch(setPreviousQueriesFilter(filter));

  return (
    <SxSmallTabNavigation
      className="previous-queries-filter"
      options={OPTIONS}
      selectedTab={selectedFilter}
      onSelectTab={tab => setFilter(tab)}
    />
  );
};

export default PreviousQueriesFilter;
