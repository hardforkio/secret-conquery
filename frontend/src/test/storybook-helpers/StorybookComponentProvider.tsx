import { createBrowserHistory } from "history";
import React from "react";
import { makeStore } from "../../js/store";
import { Provider } from "react-redux";
import { AnyAction } from "redux";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../../app-theme";
import { DndProvider } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import { CustomHTML5toTouch } from "../../js/app/Content";
import StandardQueryEditorTab from "../../js/standard-query-editor";
import TimebasedQueryEditorTab from "../../js/timebased-query-editor";
import FormsTab from "../../js/external-forms";
import { initializeLocalization } from "../../js/localization";
import translationsDe from "../../localization/de.json";
import { de } from "date-fns/locale";

initializeLocalization("de", de, translationsDe);

const browserHistory = createBrowserHistory();
const tabs = [StandardQueryEditorTab, TimebasedQueryEditorTab, FormsTab];

type Props = {
  actions: AnyAction[];
  children: any;
};

export const ProviderForAllTheShitYouMayNeed: React.FC<Props> = ({
  children,
  actions
}) => {
  const store = makeStore({}, browserHistory, tabs);
  actions.map(store.dispatch);
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <DndProvider backend={MultiBackend} options={CustomHTML5toTouch}>
          {children}
        </DndProvider>
      </ThemeProvider>
    </Provider>
  );
};
