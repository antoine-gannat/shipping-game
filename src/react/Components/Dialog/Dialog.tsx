import React from "react";
import { createUseStyles } from "react-jss";
import {
  IDialog,
  IContentButton,
  IContentText,
  IContentDropdownWithButton,
} from "../../types";
import { dispatch } from "../../../store";

type WithCloseCallback<T> = T & { closeDialog: () => void };

const useStyles = createUseStyles({
  root: {
    width: "auto",
    position: "absolute",
    zIndex: 11,
    backgroundColor: "grey",
    userSelect: "none",
    borderRadius: "5px",
  },
  container: {
    position: "relative",
    padding: "15px",
    whiteSpace: "nowrap",
    color: "white",
    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
    cursor: "move",
  },
  button: {
    color: "white",
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "3px",
  },
});

function TextContent({
  text,
}: WithCloseCallback<IContentText>): React.ReactElement {
  return <p>{text}</p>;
}

function DropdownContent({
  onClick,
  text,
  dropdownContent,
  closeDialog,
  closeOnClick,
}: WithCloseCallback<IContentDropdownWithButton>): React.ReactElement {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const onClickHandler = () => {
    onClick(selectRef.current.value);
    if (closeOnClick) {
      console.log("close dropdown");
      closeDialog();
    }
  };
  return (
    <div>
      <select ref={selectRef}>
        {dropdownContent.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>
      <button onClick={onClickHandler}>{text}</button>
    </div>
  );
}

function ButtonContent({
  text,
  onClick,
  closeDialog,
  closeOnClick,
}: WithCloseCallback<IContentButton>): React.ReactElement {
  const onClickHandler = () => {
    onClick();
    if (closeOnClick) {
      closeDialog();
    }
  };
  return <button onClick={onClickHandler}>{text}</button>;
}

const componentMap: Record<
  IDialog["content"][0]["kind"],
  React.ComponentType<WithCloseCallback<any>>
> = {
  button: ButtonContent,
  "dropdown-with-button": DropdownContent,
  text: TextContent,
};

export function Dialog({ dialog }: { dialog: IDialog }): React.ReactElement {
  const [positionState, setPosition] = React.useState({ ...dialog.position });
  const lastClickPosRef = React.useRef<{ x: number; y: number }>();
  const initalClickOffset = React.useRef<{ x: number; y: number }>();
  const styles = useStyles();

  const closeDialog = React.useCallback(
    () => dispatch("removeDialog", dialog),
    [dialog]
  );

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      lastClickPosRef.current = { x: e.clientX, y: e.clientY };
      initalClickOffset.current = {
        x: e.clientX - positionState.x,
        y: e.clientY - positionState.y,
      };
    },
    [positionState]
  );

  const onMouseUp = React.useCallback(() => {
    lastClickPosRef.current = undefined;
    initalClickOffset.current = undefined;
  }, []);
  const onMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (!lastClickPosRef.current || !initalClickOffset.current) {
      return;
    }
    setPosition({
      x: e.clientX - initalClickOffset.current.x,
      y: e.clientY - initalClickOffset.current.y,
    });
    lastClickPosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <div
      className={styles.root}
      style={{ left: positionState.x, top: positionState.y }}
    >
      <div
        className={styles.container}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <h1>{dialog.title}</h1>
        {dialog.content.map((c, i) => {
          const Component = componentMap[c.kind];
          return (
            Component && <Component key={i} closeDialog={closeDialog} {...c} />
          );
        })}
      </div>
      <button className={styles.button} onClick={closeDialog}>
        X
      </button>
    </div>
  );
}
