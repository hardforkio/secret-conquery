import { CLICK_PANE_TAB } from "./actionTypes";

export interface TabType {
  label: string;
  key: string;
}

export interface PanesStateT {
  left: {
    activeTab: "conceptTrees" | "previousQueries" | "formConfigs";
    tabs: TabType[];
  };
  right: {
    activeTab: string;
    tabs: TabType[];
  };
}

// @ts-ignore
export const buildPanesReducer = tabs => {
  const initialState: PanesStateT = {
    left: {
      activeTab: "conceptTrees",
      tabs: [
        { label: "leftPane.conceptTrees", key: "conceptTrees" },
        { label: "leftPane.previousQueries", key: "previousQueries" },
        { label: "leftPane.formConfigs", key: "formConfigs" }
      ]
    },
    right: {
      activeTab: tabs[0].key,
      // @ts-ignore
      tabs: tabs.map(tab => ({ label: tab.label, key: tab.key }))
    }
  };

  return (
    state: PanesStateT = initialState,
    action: Record<string, any>
  ): PanesStateT => {
    // @ts-ignore
    switch (action.type) {
      case CLICK_PANE_TAB:
        // @ts-ignore
        const { paneType, tab } = action.payload;

        return {
          ...state,
          [paneType]: {
            // @ts-ignore
            ...state[paneType],
            activeTab: tab
          }
        };
      default:
        return state;
    }
  };
};
