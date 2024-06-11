import { Dexie, Table } from "dexie";
import { IDbJourney, IDbPort, IDbShip } from "./types";
import { ID } from "../types";
import { countriesSorted } from "../store/world";

const CURRENT_DB_VERSION = 1;

class Database extends Dexie {
  ships!: Table<IDbShip, ID>;
  ports!: Table<IDbPort, ID>;
  journeys!: Table<IDbJourney, ID>;
  constructor() {
    super("shipping-game-db");
  }

  public async init(): Promise<void> {
    this.initializeStores();
    await this.populateDB();
  }

  private initializeStores() {
    this.version(CURRENT_DB_VERSION).stores({
      ships: "++id, name, type, portId, journeyId",
      ports: "++id, name, owned",
      journeys:
        "++id, shipId, originPortId, destinationPortId, departureTime, duration",
    });
  }
  private async populateDB() {
    const alreadyPopulated = (await this.ports.count()) > 0;
    if (alreadyPopulated) {
      return;
    }
    // add some initial data

    // add ports
    countriesSorted.forEach((country) => {
      this.ports.add({ name: country, owned: "false", ships: [] });
    });
  }
}

export const db = new Database();
