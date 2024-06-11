import { db } from "../../database";
import { StoreReducer } from "../types";

export const buyPort: StoreReducer<"buyPort"> = async (store, { portName }) => {
  const isFirstPort = !!!(await db.ports
    .filter((o) => o.owned === "true")
    .count());
  console.log({ isFirstPort });

  // get the port id
  const port = await db.ports.get({ name: portName });
  // if this is the first port to be bought, add a ship to it
  await db.ports.update(port.id, { owned: "true" });
  if (isFirstPort) {
    const newShipId = await db.ships.add({
      name: "First ship",
      type: "cargo-small",
      portId: port.id,
    });
    await db.ports.update(port.id, { ships: [newShipId] });
  }
  return store;
};
