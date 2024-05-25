type ID = number;

export interface IDbPort {
  id?: ID;
  name: string;
  owned: "true" | "false";
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
