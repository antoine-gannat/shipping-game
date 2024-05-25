import React from "react";
import { IBaseProps } from "../../types";
import { useStyles } from "./Navbar.styles";
import { dispatch } from "../../../store";
import { IPortScene } from "../../../store/types";

export function Navbar({ store }: IBaseProps): React.ReactElement {
  const styles = useStyles();

  const isPort = React.useMemo(
    () => store.scene.kind === "port",
    [store.scene.kind]
  );

  const onWorldBtnClick = React.useCallback(() => {
    dispatch("viewWorld", {});
  }, []);

  return (
    <div className={styles.navbar}>
      <h1>{isPort ? (store.scene as IPortScene).portName : "World"}</h1>
      {isPort && <button onClick={onWorldBtnClick}>Back to world</button>}
    </div>
  );
}
