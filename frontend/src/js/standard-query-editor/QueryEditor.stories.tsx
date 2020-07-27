import React from "react";
import { QueryEditor } from "./QueryEditor";
import { StoryWrapper } from "../../storybook";

export default {
  component: QueryEditor,
  title: "Query Editor"
};

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

export const Default = () => (
  <StoryWrapper actions={[dropAction]}>
    <QueryEditor selectedDatasetId={"blub"} />
  </StoryWrapper>
);
