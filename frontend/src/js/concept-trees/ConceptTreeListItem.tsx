import * as React from "react";

import type { ConceptT, ConceptIdT } from "../api/types";

import ConceptTree from "./ConceptTree";
import ConceptTreeFolder from "./ConceptTreeFolder";

import { getConceptById } from "./globalTreeStoreHelper";

import { isNodeInSearchResult } from "./selectors";

import type { TreesT, SearchT } from "./reducer";

type PropsT = {
  trees: TreesT;
  tree: ConceptT;
  treeId: ConceptIdT;
  search: SearchT;
  onLoadTree: (id: string) => void;
};

export default ({ trees, treeId, search, onLoadTree }: PropsT) => {
  const tree = trees[treeId];

  //@ts-ignore
  if (!isNodeInSearchResult(treeId, tree.children, search)) return null;

  const rootConcept = getConceptById(treeId);

  const commonProps = {
    treeId,
    search,
    onLoadTree,
    depth: 0
  };

  return tree.detailsAvailable ? (
    <ConceptTree
      id={treeId}
      label={tree.label}
      //@ts-ignore
      description={tree.description}
      tree={rootConcept}
      //@ts-ignore
      loading={!!tree.loading}
      //@ts-ignore
      error={tree.error}
      {...commonProps}
    />
  ) : (
    <ConceptTreeFolder
      //@ts-ignore
      trees={trees}
      tree={tree}
      active={tree.active}
      openInitially
      {...commonProps}
    />
  );
};
