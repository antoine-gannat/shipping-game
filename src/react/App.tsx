import * as React from "react";
import { createUseStyles } from "react-jss";
import { registerUIApi } from "./reactApi";
import { Dialog, IDialog } from "./Components/Dialog";

const useStyles = createUseStyles({
  root: {
    top: 0,
    left: 0,
    // width: "100%",
    // height: "100%",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
    // userSelect: "none",
  },
});

export function App() {
  const styles = useStyles();
  const [dialogs, setDialogs] = React.useState<Record<string, IDialog>>({});

  React.useEffect(() => {
    const cleanups = [
      registerUIApi("show-ship-info", (e) =>
        setDialogs((prev) => ({
          ...prev,
          [`ship-${e.shipId}`]: {
            title: `Ship ${e.shipId} info`,
            content: "Ship info here",
            position: e.clickPosition,
          },
        }))
      ),
      registerUIApi("show-building-info", (e) =>
        setDialogs((prev) => ({
          ...prev,
          [`building-${e.buildingId}`]: {
            title: `Building ${e.buildingId} info`,
            content: "Building info here",
            position: e.clickPosition,
          },
        }))
      ),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (Object.keys(dialogs).length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      {Object.keys(dialogs).map((dialogId) => (
        <Dialog
          key={dialogId}
          {...dialogs[dialogId]}
          onClose={() =>
            setDialogs((prev) => {
              const copy = { ...prev };
              delete copy[dialogId];
              return copy;
            })
          }
        />
      ))}
    </div>
  );
}
