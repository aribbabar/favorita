// react
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// context providers
import UserContextProvider from "./contexts/UserContext";

// global styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
