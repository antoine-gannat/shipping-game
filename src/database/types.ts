import { IPosition } from "../types";

type ID = number;

export interface IDbPort {
  id: ID;
  name: string;
  position: IPosition;
  owned: boolean;
}

export interface IDbShip {
  id: ID;
  name: string;
  type: string;
  portId?: ID;
  journeyId?: ID;
}

export interface IDbJourney {
  id: ID;
  shipId: ID;
  originPortId: ID;
  destinationPortId: ID;
  departureTime: number;
  duration: number;
}
