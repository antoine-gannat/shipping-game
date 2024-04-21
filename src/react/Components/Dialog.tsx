import React from "react";
import { createUseStyles } from "react-jss";
import { IPosition } from "../../types";

export interface IDialog {
  title: string;
  content: string;
  position: IPosition;
}

interface IDialogProps extends IDialog {
  onClose: () => void;
}

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

export function Dialog({
  onClose,
  title,
  content,
  position,
}: IDialogProps): React.ReactElement {
  const [positionState, setPosition] = React.useState({ ...position });
  const lastClickPosRef = React.useRef<{ x: number; y: number }>();
  const initalClickOffset = React.useRef<{ x: number; y: number }>();
  const styles = useStyles();

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
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
      <button className={styles.button} onClick={onClose}>
        X
      </button>
    </div>
  );
}
