import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import ZaraHealth from "./ZaraHealth.jsx";

ReactDOM.render(
  <React.StrictMode>
    <ZaraHealth />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline andP load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
