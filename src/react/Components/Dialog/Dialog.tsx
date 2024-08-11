import React from "react";
import {
  IDialog,
  IContentButton,
  IContentText,
  IContentDropdownWithButton,
} from "../../types";
import { dispatch } from "../../../store";
import { Window } from "../Window/Window";

function TextContent({ text }: IContentText): React.ReactElement {
  return <p>{text}</p>;
}

function DropdownContent({
  onClick,
  text,
  dropdownContent,
}: IContentDropdownWithButton): React.ReactElement {
  const selectRef = React.useRef<HTMLSelectElement>(null);

  return (
    <div>
      <select ref={selectRef}>
        {dropdownContent.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>
      <button onClick={() => onClick(selectRef.current.value)}>{text}</button>
    </div>
  );
}

function ButtonContent({ text, onClick }: IContentButton): React.ReactElement {
  return <button onClick={onClick}>{text}</button>;
}

const componentMap: Record<
  IDialog["content"][0]["kind"],
  React.ComponentType<any>
> = {
  button: ButtonContent,
  "dropdown-with-button": DropdownContent,
  text: TextContent,
};

export function Dialog({
  id,
  content,
  position,
  title,
}: IDialog): React.ReactElement {
  const [positionState, setPosition] = React.useState({ ...position });
  const lastClickPosRef = React.useRef<{ x: number; y: number }>();
  const initalClickOffset = React.useRef<{ x: number; y: number }>();

  const onMouseMove = React.useCallback((e: MouseEvent) => {
    if (!lastClickPosRef.current || !initalClickOffset.current) {
      return;
    }
    setPosition({
      x: e.clientX - initalClickOffset.current.x,
      y: e.clientY - initalClickOffset.current.y,
    });
    lastClickPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseUp = React.useCallback(() => {
    lastClickPosRef.current = undefined;
    initalClickOffset.current = undefined;
    document.body.removeEventListener("mouseup", onMouseUp);
    document.body.removeEventListener("mousemove", onMouseMove);
  }, []);

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // Add listeners to the body to handle mouse up and move.
      // If we add these to the component, we would lose the mouse up event
      // if the mouse is moved out of the component.
      document.body.addEventListener("mouseup", onMouseUp);
      document.body.addEventListener("mousemove", onMouseMove);
      lastClickPosRef.current = { x: e.clientX, y: e.clientY };
      initalClickOffset.current = {
        x: e.clientX - positionState.x,
        y: e.clientY - positionState.y,
      };
    },
    [positionState]
  );

  return (
    <Window
      style={{
        left: positionState.x,
        top: positionState.y,
        cursor: "move",
        position: "absolute",
      }}
      title={title}
      onMouseDown={onMouseDown}
      onClear={() => dispatch("removeDialog", { dialogId: id })}
    >
      {content.map((c) => {
        const Component = componentMap[c.kind];
        return Component && <Component key={c.text} {...c} />;
      })}
    </Window>
  );
}
