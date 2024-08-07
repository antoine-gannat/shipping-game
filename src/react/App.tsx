import * as React from "react";
import { createUseStyles } from "react-jss";
import { IStore } from "../store/types";
import { get, subscribe } from "../store";
import { Navbar } from "./Components/Navbar/Navbar";
import { IBaseProps, IDialog } from "./types";
import { Dialog } from "./Components/Dialog/Dialog";
import { Welcome } from "./Components/Welcome/Welcome";
import { Events } from "./Components/Events/Events";

const useStyles = createUseStyles({
  root: {
    top: 0,
    left: 0,
    width: "100%",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
  },
});

export function App() {
  const styles = useStyles();
  const [store, setStore] = React.useState<IStore>();
  const [isNewPlayer, setIsNewPlayer] = React.useState<boolean>(false);

  React.useEffect(() => {
    get("getIsNewPlayer").then(setIsNewPlayer);

    // listen for store changes and return cleanup fct
    return subscribe((_, newStore) => setStore(newStore));
  }, []);

  // don't render until we have the store
  if (!store) {
    return null;
  }

  const baseProps: IBaseProps = { store };

  return (
    <div className={styles.root}>
      {/* Welcome screen for new players */}
      {isNewPlayer && <Welcome />}
      {/* Navbar */}
      <Navbar {...baseProps} />
      {store.dialogs.map((dialog) => (
        <Dialog key={dialog.title} dialog={dialog as IDialog} />
      ))}
      <Events {...baseProps} />
    </div>
  );
}
