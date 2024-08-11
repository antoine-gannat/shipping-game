import * as React from "react";
import { IStore } from "../store/types";
import { get, subscribe } from "../store";
import { Navbar } from "./Components/Navbar/Navbar";
import { IBaseProps, IDialog } from "./types";
import { Dialog } from "./Components/Dialog/Dialog";
import { Welcome } from "./Components/Welcome/Welcome";
import { Events } from "./Components/Events/Events";
import { useStyles } from "./App.styles";
import { Ports } from "./Components/Ports/Ports";

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
        <Dialog key={dialog.title} {...(dialog as IDialog)} />
      ))}
      <div className={styles.leftWindows}>
        <Events {...baseProps} />
        <Ports {...baseProps} />
      </div>
    </div>
  );
}
