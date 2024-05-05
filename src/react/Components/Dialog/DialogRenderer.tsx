import React from "react";
import { IBaseProps } from "../../types";
import { Dialog, IDialog } from "./Dialog";
import { registerUIApi } from "../../reactApi";
import { getCountryFromId } from "../../../store/world";

export function DialogRenderer(_: IBaseProps): React.ReactElement {
  const [dialogs, setDialogs] = React.useState<Record<string, IDialog>>({});

  React.useEffect(() => {
    // listen for events from the game
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
      registerUIApi("show-country-info", (e) =>
        setDialogs((prev) => ({
          ...prev,
          [`country-${e.countryId}`]: {
            title: getCountryFromId(e.countryId),
            content: "Country info here",
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
    <>
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
    </>
  );
}
