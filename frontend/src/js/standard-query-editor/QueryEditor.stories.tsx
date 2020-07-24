import React from "react";
import { QueryEditor } from "./QueryEditor";
import { ProviderForAllTheShitYouMayNeed } from "../../test/storybook-helpers/StorybookComponentProvider";

export default {
  component: QueryEditor,
  title: "Query Editor"
};

export const Default = () => (
  <ProviderForAllTheShitYouMayNeed actions={[]}>
    <QueryEditor selectedDatasetId={"blub"} />
  </ProviderForAllTheShitYouMayNeed>
);

const dropAction = {
  type: "query-editor/DROP_AND_NODE",
  payload: {
    item: {
      width: 572.2000122070312,
      height: 20,
      ids: ["action_movies"],
      label: "Action Movies",

      tree: "movie_appearances"
    }
  }
};

export const WithNode = () => (
  <ProviderForAllTheShitYouMayNeed actions={[dropAction]}>
    <QueryEditor selectedDatasetId={"blub"} />
  </ProviderForAllTheShitYouMayNeed>
);
