import React from "react"
import ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import rootStore from "./store"
import App from "./components/App/App"

import "./index.css"

const store = rootStore();

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
)