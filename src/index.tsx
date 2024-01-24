import { createRoot } from "react-dom/client";
import { App } from "./App";
import * as React from "react";
import * as PIXI from "pixi.js";

const reactRoot = document.getElementById("react-root");
const pixiRoot = document.getElementById("pixi-root");

createRoot(reactRoot).render(<App />);

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "blue",
  resizeTo: pixiRoot,
});

pixiRoot.appendChild(app.view);
