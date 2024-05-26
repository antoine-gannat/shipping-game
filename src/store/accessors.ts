import { db } from "../database";
import { StoreAccessor, StoreAccessorEvent } from "./types";

// Accessors, they are used to read the store and database.
export const accessors: { [E in StoreAccessorEvent]: StoreAccessor<E> } = {
  getIsNewPlayer: async () => {
    // check if the user is a new player by counting the number of owned ports
    const ownedPortsCount = await db.ports
      .where("owned")
      .equals("true")
      .count();
    return ownedPortsCount === 0;
  },
};
