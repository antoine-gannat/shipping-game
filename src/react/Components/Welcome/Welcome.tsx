import React from "react";
import { useStyles } from "./Welcome.styles";

export function Welcome() {
  const [hide, setHide] = React.useState(false);
  const styles = useStyles();
  if (hide) {
    return null;
  }
  return (
    <div className={styles.welcome}>
      <h1>Welcome to the game!</h1>
      <h2>Select your starting country on the map to start shipping.</h2>
      <button onClick={() => setHide(true)}>Start</button>
    </div>
  );
}
