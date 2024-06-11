import { dispatch } from "..";
import { db } from "../../database";
import { IDialog } from "../../react/types";
import { StoreReducer } from "../types";
import { countriesSorted } from "../world";

export const createCountryDialog: StoreReducer<"createCountryDialog"> = async (
  _store,
  { countryName, dialogPosition }
) => {
  const isOwned = (await db.ports.get({ name: countryName }))?.owned === "true";
  const content: IDialog["content"] = isOwned
    ? [
        {
          kind: "button",
          text: "Visit port",
          onClick: () => {
            dispatch("visitPort", { portName: countryName });
          },
          closeOnClick: true,
        },
      ]
    : [];
  if (!isOwned) {
    content.unshift({
      kind: "button",
      text: "Buy port",
      onClick: () => {
        dispatch("buyPort", { portName: countryName }).then(() => {
          dispatch("visitPort", { portName: countryName });
        });
      },
      closeOnClick: true,
    });
  }
  return dispatch("createDialog", {
    title: countryName,
    position: dialogPosition,
    content,
  });
};

export const createShipDialog: StoreReducer<"createShipDialog"> = async (
  _store,
  { shipId, dialogPosition }
) => {
  const ship = await db.ships.get({ id: shipId });
  if (!ship) {
    console.warn("Ship not found", shipId);
    return;
  }
  const content: IDialog["content"] = [
    {
      kind: "dropdown-with-button",
      text: "New journey",
      onClick: (destination) => {
        dispatch("newJourney", { shipId, destination });
      },
      dropdownContent: countriesSorted,
      closeOnClick: true,
    },
  ];
  return dispatch("createDialog", {
    title: ship.name,
    position: dialogPosition,
    content,
  });
};

export const createDialog: StoreReducer<"createDialog"> = (store, dialog) => {
  if (store.dialogs.find((d) => d.title === dialog.title)) {
    console.warn("Dialog already exists", dialog.title);
    return store;
  }
  return {
    ...store,
    dialogs: [...store.dialogs, dialog],
  };
};

export const removeDialog: StoreReducer<"removeDialog"> = (store, dialog) => {
  return {
    ...store,
    dialogs: store.dialogs.filter((d) => d !== dialog),
  };
};
