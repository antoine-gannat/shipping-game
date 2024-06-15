import { __internalDispatch, dispatch } from "..";
import { db } from "../../database";
import { IDialog } from "../../react/types";
import { uniqueRuntimeId } from "../../utils/uniqueRuntimeId";
import { StoreReducer } from "../types";
import { countriesSorted } from "../world";

export const createCountryDialog: StoreReducer<"createCountryDialog"> = async (
  _store,
  { countryName, dialogPosition }
) => {
  const isOwned = (await db.ports.get({ name: countryName }))?.owned === "true";
  const id = uniqueRuntimeId();
  const content: IDialog["content"] = isOwned
    ? [
        {
          kind: "button",
          text: "Visit port",
          onClick: () => {
            dispatch("removeDialog", { dialogId: id });
            dispatch("visitPort", { portName: countryName });
          },
        },
      ]
    : [];
  if (!isOwned) {
    content.unshift({
      kind: "button",
      text: "Buy port",
      onClick: () => {
        dispatch("buyPort", { portName: countryName });
        dispatch("visitPort", { portName: countryName });
      },
    });
  }
  return __internalDispatch("addDialog", {
    id,
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
  const id = uniqueRuntimeId();
  const content: IDialog["content"] = [
    {
      kind: "dropdown-with-button",
      text: "New journey",
      onClick: (destination) => {
        dispatch("removeDialog", { dialogId: id });
        dispatch("newJourney", { shipId, destination });
      },
      dropdownContent: countriesSorted,
    },
  ];
  return __internalDispatch("addDialog", {
    id,
    title: ship.name,
    position: dialogPosition,
    content,
  });
};

export const addDialog: StoreReducer<"addDialog"> = (store, dialog) => {
  if (store.dialogs.find((d) => d.id === dialog.id)) {
    console.warn("A Dialog with that ID already exists", dialog.id);
    return store;
  }
  return {
    ...store,
    dialogs: [...store.dialogs, dialog],
  };
};

export const removeDialog: StoreReducer<"removeDialog"> = (
  store,
  { dialogId }
) => {
  return {
    ...store,
    dialogs: store.dialogs.filter((d) => d.id !== dialogId),
  };
};
