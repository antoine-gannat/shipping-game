import React from "react";
import { IBaseProps } from "../../types";
import { Window } from "../Window/Window";
import { useStyles } from "./Events.styles";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";

const valToPercent = (val: number, max: number) => (val / max) * 100;

export function Events({}: IBaseProps): React.ReactElement {
  const journeys = useLiveQuery(() => db.journeys.toArray());
  const ports = useLiveQuery(() => db.ports.toArray());
  const journeysWithPort = React.useMemo(
    () =>
      journeys?.map((j) => ({
        ...j,
        originPortName: ports.find((p) => p.id === j.originPortId)?.name,
        destinationPortName: ports.find((p) => p.id === j.destinationPortId)
          ?.name,
      })),
    [journeys, ports]
  );
  const styles = useStyles();

  return (
    <Window title="Events" className={styles.container}>
      {journeysWithPort?.map((journey) => (
        <div key={journey.id}>
          {journey.originPortName}
          <progress
            max={100}
            value={valToPercent(
              Date.now() - journey.departureTime,
              journey.duration
            )}
          />
          {journey.destinationPortName}
        </div>
      ))}
      {(!journeysWithPort || journeysWithPort.length === 0) && (
        <div>No active journeys</div>
      )}
    </Window>
  );
}
