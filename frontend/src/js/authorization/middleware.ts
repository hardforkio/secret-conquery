import { push } from "react-router-redux";
import { isLoginDisabled } from "../environment";

export function createUnauthorizedErrorMiddleware() {
  const loginDisabled = isLoginDisabled();

  return (store: Record<string, any>) => (next: Function) => (action: any) => {
    if (!loginDisabled && action.payload && action.payload.status === 401)
      store.dispatch(push("/login"));

    return next(action);
  };
}
