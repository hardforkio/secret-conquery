import React from "react";

import type { TabPropsType } from "../pane";
import { QueryEditor } from "./QueryEditor";
import { StandardQueryRunner } from "./StandardQueryRunner";
import { QueryClearButton } from "./QueryClearButton";

const StandardQueryEditorTab = (props: TabPropsType) => (
  <div className="d-flex flex-column flex-grow-1">
    <QueryClearButton />
    <QueryEditor selectedDatasetId={props.selectedDatasetId} />
    <StandardQueryRunner datasetId={props.selectedDatasetId} />
  </div>
);

export default StandardQueryEditorTab;
