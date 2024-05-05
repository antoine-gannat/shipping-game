import { ColorOverlayFilter } from "@pixi/filter-color-overlay";
import { Container } from "pixi.js";

export function addHoverStyling(el: Container): void {
  el.eventMode = "static";
  el.on("pointerenter", () => {
    el.filters = [new ColorOverlayFilter([1, 0.9, 0], 0.3)];
    // due to react being displayed on top of the canvas, we need to change the cursor manually
    document.documentElement.style.cursor = "pointer";
  });
  el.on("pointerleave", () => {
    el.filters = [];
    // due to react being displayed on top of the canvas, we need to change the cursor manually
    document.documentElement.style.cursor = "default";
  });
}
