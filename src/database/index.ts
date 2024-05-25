import { Dexie, Table } from "dexie";
import { IDbJourney, IDbPort, IDbShip } from "./types";

const CURRENT_DB_VERSION = 1;

class Database extends Dexie {
  ships!: Table<IDbShip>;
  ports!: Table<IDbPort>;
  journeys!: Table<IDbJourney>;
  constructor() {
    super("shipping-game-db");
    this.initializeStores();
  }

  private initializeStores() {
    this.version(CURRENT_DB_VERSION).stores({
      ships: "++id, name, type, portId, journeyId",
      ports: "++id, name, owned",
      journeys:
        "++id, shipId, originPortId, destinationPortId, departureTime, duration",
    });
  }
}

export const db = new Database();
