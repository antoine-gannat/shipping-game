import { db } from "../../database";
import { StoreReducer } from "../types";

export const newJourney: StoreReducer<"newJourney"> = async (
  store,
  { shipId, destination }
) => {
  const ship = await db.ships.get({ id: shipId });
  if (!ship) {
    console.warn("Ship not found", shipId);
    return store;
  }
  // check if the ship is already on a journey
  const isOnJourney = await db.journeys.get({ shipId });
  if (isOnJourney) {
    console.warn(
      "Ship is already on a journey to",
      isOnJourney.destinationPortId
    );
    return store;
  }
  // find current port
  const originPort = await db.ports
    .filter((port) => port.ships.includes(shipId))
    .first();
  if (!originPort) {
    console.warn("No port found with with ship", shipId);
    return store;
  }
  // find the destination
  const destinationPort = await db.ports.get({ name: destination });
  if (!destinationPort) {
    console.warn("Destination port not found", destination);
    return store;
  }
  // TODO: Add journey duration calculation
  const duration = 1000 * 60;
  await db.journeys.add({
    shipId,
    originPortId: originPort.id,
    destinationPortId: destinationPort.id,
    departureTime: Date.now(),
    duration,
  });
  // remove ship from origin port
  await db.ports.update(originPort.id, {
    ships: originPort.ships.filter((s) => s !== shipId),
  });
  // change ship port
  await db.ships.update(shipId, { portId: undefined });
  return store;
};
