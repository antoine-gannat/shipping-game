import { createRoot } from "react-dom/client";
import { App } from "./react/App";
import * as React from "react";
import { app } from "./Pixi";
import Game from "./game/Game";

const reactRoot = document.getElementById("react-root");
const pixiRoot = document.getElementById("pixi-root");

createRoot(reactRoot).render(<App />);

app.resizeTo = pixiRoot;
pixiRoot.appendChild(app.view);

new Game();
