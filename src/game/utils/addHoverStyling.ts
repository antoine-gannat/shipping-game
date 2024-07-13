import { Container, ColorMatrixFilter } from "pixi.js";

export function addHoverStyling(el: Container, brightness = 0.7): void {
  el.eventMode = "static";
  el.on("pointerenter", () => {
    const filter = new ColorMatrixFilter();
    el.filters = [filter];
    filter.brightness(brightness, true);
    // due to react being displayed on top of the canvas, we need to change the cursor manually
    document.documentElement.style.cursor = "pointer";
  });
  el.on("pointerleave", () => {
    el.filters = [];
    // due to react being displayed on top of the canvas, we need to change the cursor manually
    document.documentElement.style.cursor = "default";
  });
}
