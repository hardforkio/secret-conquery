import { applyMiddleware, compose, createStore, Store } from "redux";

import buildAppReducer from "./app/reducers";
import { isProduction } from "./environment";
import devMiddleware from "./middleware/devMiddleware";
import prodMiddleware from "./middleware/prodMiddleware";

export function makeStore(
  initialState: Record<string, any>,
  browserHistory: Record<string, any>,
  tabs: Record<string, any>
) {
  const createMiddleware =
    process.env.NODE_ENV === "production" ? prodMiddleware : devMiddleware;
  const middleware = applyMiddleware(...createMiddleware(browserHistory));

  let enhancer;

  if (!isProduction()) {
    enhancer = compose(
      middleware,
      // Use the Redux devtools extention, but only in development
      //@ts-ignore
      window.devToolsExtension ? window.devToolsExtension() : f => f
    );
  } else {
    enhancer = compose(middleware);
  }

  //@ts-ignore
  const store = createStore(buildAppReducer(tabs), initialState, enhancer);

  //@ts-ignore
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    //@ts-ignore
    module.hot.accept("./app/reducers", () => {
      //@ts-ignore
      const nextRootReducer = buildAppReducer(tabs);

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

//@ts-ignore
export function updateReducers(store: Store, tabs: TabT[]) {
  store.replaceReducer(buildAppReducer(tabs));
}
