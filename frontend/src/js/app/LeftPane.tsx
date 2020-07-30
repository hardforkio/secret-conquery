import React from "react";
import { useSelector } from "react-redux";

import type { DatasetIdT } from "../api/types";

import Pane from "../pane/Pane";
import ConceptTreeList from "../concept-trees/ConceptTreeList";
import ConceptTreeSearchBox from "../concept-trees/ConceptTreeSearchBox";
import PreviousQueriesTab from "../previous-queries/list/PreviousQueriesTab";
import FormConfigsTab from "../external-forms/form-configs/FormConfigsTab";
import { StateT } from "./reducers";

const LeftPane = () => {
  const activeTab = useSelector<StateT, string>(
    state => state.panes.left.activeTab
  );
  const selectedDatasetId = useSelector<StateT, DatasetIdT | null>(
    state => state.datasets.selectedDatasetId
  );

  return (
    <Pane left>
      {activeTab === "conceptTrees" && (
        //@ts-ignore
        <ConceptTreeSearchBox datasetId={selectedDatasetId} />
      )}
      <div className="overflow-auto">
        <ConceptTreeList
          //@ts-ignore
          datasetId={selectedDatasetId}
        />
      </div>

      {activeTab === "previousQueries" && (
        <PreviousQueriesTab
          //@ts-ignore
          datasetId={selectedDatasetId}
        />
      )}
      {activeTab === "formConfigs" && (
        <FormConfigsTab datasetId={selectedDatasetId} />
      )}
    </Pane>
  );
};

export default LeftPane;
