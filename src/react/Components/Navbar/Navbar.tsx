import React from "react";
import { IBaseProps } from "../../types";
import { useStyles } from "./Navbar.styles";
import { dispatch } from "../../../store";

export function Navbar({ store }: IBaseProps): React.ReactElement {
  const styles = useStyles();

  const isPort = store.scene.kind === "port";

  const onWorldBtnClick = React.useCallback(() => {
    dispatch("viewWorld", {});
  }, []);

  return (
    <div className={styles.navbar}>
      {isPort && <button onClick={onWorldBtnClick}>Back to world</button>}

      <h1>{isPort ? "Port A" : "World"}</h1>
    </div>
  );
}
