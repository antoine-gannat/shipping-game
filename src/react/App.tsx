import * as React from "react";
import { createUseStyles } from "react-jss";
import { registerUIApi } from "./reactApi";
import { Dialog } from "./Components/Dialog";

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
  const [dialogs, setDialogs] = React.useState<React.ReactNode[]>([]);

  const addDialogWithClose = React.useCallback(
    (
      title: string,
      content: React.ReactNode,
      position: { x: number; y: number }
    ) => {
      const newEl = (
        <Dialog
          position={position}
          onClose={() => {
            // TO FIX
            setDialogs((prev) => prev.filter((el) => el !== newEl));
          }}
          title={title}
          content={content}
        />
      );
      setDialogs((prev) => [...prev, newEl]);
    },
    []
  );

  React.useEffect(() => {
    const cleanups = [
      registerUIApi("show-ship-info", (e) =>
        addDialogWithClose(
          `Ship ${e.shipId} info`,
          <p>Ship info here</p>,
          e.clickPosition
        )
      ),
      registerUIApi("show-building-info", (e) =>
        addDialogWithClose(
          `Building ${e.buildingId} info`,
          <p>Building info here</p>,
          e.clickPosition
        )
      ),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (dialogs.length === 0) {
    return null;
  }

  return (
    <div className={styles.root}>
      {dialogs.map((dialog, index) => (
        <React.Fragment key={index}>{dialog}</React.Fragment>
      ))}
    </div>
  );
}
