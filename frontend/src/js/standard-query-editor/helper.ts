import { getConceptById } from "../concept-trees/globalTreeStoreHelper";

import type { QueryNodeType } from "./types";

export function getRootNodeLabel(node: QueryNodeType) {
  // @ts-ignore
  if (!node.ids || !node.tree) return null;

  // @ts-ignore
  const nodeIsRootNode = node.ids.indexOf(node.tree) !== -1;

  if (nodeIsRootNode) return null;

  // @ts-ignore
  const root = getConceptById(node.tree);

  return !!root ? root.label : null;
}
