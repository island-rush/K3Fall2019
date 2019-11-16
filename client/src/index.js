import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./Game.css";

import { Provider } from "react-redux";
import setupStore from "./redux/setupStore";

ReactDOM.render(
    <Provider store={setupStore()}>
        <App />
    </Provider>,
    document.getElementById("root")
);
