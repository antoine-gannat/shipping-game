import { db } from "../../database";
import { StoreGetter, StoreGetterEvent } from "../types";

// Getters, they are used to read the store and database.
export const getters: { [E in StoreGetterEvent]: StoreGetter<E> } = {
  getIsNewPlayer: async () => {
    // check if the user is a new player by counting the number of owned ports
    const ownedPortsCount = await db.ports
      .where("owned")
      .equals("true")
      .count();
    return ownedPortsCount === 0;
  },
  getActiveJourneys: async () => await db.journeys.toArray(),
  getPorts: async () => await db.ports.toArray(),
};
