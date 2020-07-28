import React from "react";
import styled from "@emotion/styled";

import QueryGroupModal from "../query-group-modal/QueryGroupModal";
import QueryUploadConceptListModal from "../query-upload-concept-list-modal/QueryUploadConceptListModal";
import type { DatasetIdT } from "../api/types";

import Query from "./Query";
import StandardQueryNodeEditor from "./StandardQueryNodeEditor";

type PropsType = {
  selectedDatasetId: DatasetIdT;
};

const Root = styled("div")`
  padding: 0 10px 10px 10px;
`;

export const QueryEditor = (props: PropsType) => (
  <Root className="flex-grow-1">
    <Query selectedDatasetId={props.selectedDatasetId} />
    <StandardQueryNodeEditor
      // @ts-ignore
      datasetId={props.selectedDatasetId}
    />
    <QueryUploadConceptListModal
      // @ts-ignore
      selectedDatasetId={props.selectedDatasetId}
    />
    <QueryGroupModal />
  </Root>
);
