import React from "react";
import { QueryEditor } from "../js/standard-query-editor/QueryEditor";
import { ProviderForAllTheShitYouMayNeed } from "./StorybookComponentProvider";

export default {
  component: QueryEditor,
  title: "Query Editor"
};

export const Default = () => (
  <ProviderForAllTheShitYouMayNeed>
    <QueryEditor selectedDatasetId={"blub"} />
  </ProviderForAllTheShitYouMayNeed>
);
