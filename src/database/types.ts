import type { ID } from "../types";

export interface IDbPort {
  id?: ID;
  name: string;
  owned: "true" | "false";
  // id of ships that are currently docked at this port
  ships: ID[];
}

export interface IDbShip {
  id?: ID;
  name: string;
  type: "cargo-small" | "cargo-large";
  portId?: ID;
  journeyId?: ID;
}

export interface IDbJourney {
  id?: ID;
  shipId: ID;
  originPortId: ID;
  destinationPortId: ID;
  departureTime: number;
  duration: number;
}

export interface IDbTimer {
  id?: ID;
  startTime: number;
  endTime: number;
  action: string;
  actionProperties: Record<string, string | number>;
}
