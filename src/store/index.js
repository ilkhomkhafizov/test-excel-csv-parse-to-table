/* eslint-disable import/no-anonymous-default-export */
import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"
import rootReducer from "../reducers"


const preloadedState = {}
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        rootReducer,
        preloadedState,
        // composeEnhancers(applyMiddleware(thunk)),
        applyMiddleware(thunk)
    );   

    return store;
};