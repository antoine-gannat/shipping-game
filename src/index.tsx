import { createRoot } from "react-dom/client";
import { App } from "./App";
import * as React from "react";
import { app } from "./Pixi";

const reactRoot = document.getElementById("react-root");
const pixiRoot = document.getElementById("pixi-root");

createRoot(reactRoot).render(<App />);

app.resizeTo = pixiRoot;
pixiRoot.appendChild(app.view);
