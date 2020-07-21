import type { ConceptIdT } from "../api/types";
import type { SearchT } from "./reducer";

const isChildWithinResults = (children: [], search: SearchT) => {
  //@ts-ignore

  return children.some(child => search.result.hasOwnProperty(child));
};

export const isNodeInSearchResult = (
  id: ConceptIdT,
  children?: [],
  //@ts-ignore

  search: SearchT
) => {
  if (!search.result) return true;

  if (search.result.hasOwnProperty(id)) return true;

  if (!!children && children.length > 0)
    return isChildWithinResults(children, search);

  return false;
};

//@ts-ignore

export const getAreTreesAvailable = state => {
  return (
    !!state.conceptTrees.trees &&
    Object.keys(state.conceptTrees.trees).length > 0
  );
};
