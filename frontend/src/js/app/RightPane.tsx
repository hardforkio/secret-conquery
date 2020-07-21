import React from "react";
import { connect } from "react-redux";
import type { TabT } from "../pane/types";

import Pane from "../pane/Pane";

type PropsType = {
  tabs: TabT[];
  activeTab: string;
  selectedDatasetId: string | null;
};

const RightPane = ({ tabs, activeTab, selectedDatasetId }: PropsType) => {
  // Won't be null, since the activeTabs string is built from tabs
  // during setup
  const theActiveTab = tabs.find(tab => tab.key === activeTab);

  //@ts-ignore
  const tab = React.createElement(theActiveTab.component, {
    selectedDatasetId: selectedDatasetId
  });

  return <Pane right>{tab}</Pane>;
};

export default connect(state => ({
  //@ts-ignore
  activeTab: state.panes.right.activeTab,
  //@ts-ignore
  selectedDatasetId: state.datasets.selectedDatasetId
}))(RightPane);
