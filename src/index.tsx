import { createRoot } from "react-dom/client";
import { App } from "./react/App";
import * as React from "react";
import { app } from "./Pixi";
import Game from "./game/Game";
import { db } from "./database";

async function main() {
  await db.init();
  const reactRoot = document.getElementById("react-root");
  const pixiRoot = document.getElementById("pixi-root");

  // init React
  createRoot(reactRoot).render(<App />);

  app.resizeTo = pixiRoot;
  pixiRoot.appendChild(app.view);

  // start game logic
  new Game();
}

main();
