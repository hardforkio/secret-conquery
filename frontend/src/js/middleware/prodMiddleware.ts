import thunk from "redux-thunk";
//@ts-ignore
import multi from "redux-multi";
import { routerMiddleware } from "react-router-redux";
import { createUnauthorizedErrorMiddleware } from "../authorization/middleware";
//@ts-ignore
import React from "react";

//@ts-ignore
export default function (browserHistory) {
  const reduxRouterMiddleware = routerMiddleware(browserHistory);
  const unauthorizedErrorMiddleware = createUnauthorizedErrorMiddleware();

  return [thunk, multi, unauthorizedErrorMiddleware, reduxRouterMiddleware];
}
