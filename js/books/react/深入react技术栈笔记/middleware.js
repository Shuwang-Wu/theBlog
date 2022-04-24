/*eslint-disable*/
import compose from "./compose";

export default function applyMiddleware(...middlewares) {
  return next => (reducer, initialState) => {
    let store = next(reducer, initialState);
    let dispatch = store.dispatch;
    let chain = [];

    var middlewareAPI = {
      getState: store.getSate,
      dispatch: action => dispatch(action)
    };

    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
}
