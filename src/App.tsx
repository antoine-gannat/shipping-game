import * as React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    top: 0,
    left: 0,
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
    userSelect: "none",
  },
});

export function App() {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <h1>HEllo</h1>
    </div>
  );
}
