import React from "react";
import { IBaseProps } from "../../types";
import { useStyles } from "./Events.styles";
import { get } from "../../../store";
import { IDbJourney } from "../../../database/types";

interface IJourney extends IDbJourney {
  originPortName: string;
  destinationPortName: string;
}

const valToPercent = (val: number, max: number) => (val / max) * 100;

export function Events({}: IBaseProps): React.ReactElement {
  const [journeys, setJourneys] = React.useState<IJourney[]>([]);
  const styles = useStyles();
  React.useEffect(() => {
    const interval = setInterval(() => {
      Promise.all([get("getActiveJourneys"), get("getPorts")]).then(
        ([j, ports]) => {
          setJourneys(
            j.map((journey) => ({
              ...journey,
              originPortName: ports.find((p) => p.id === journey.originPortId)
                ?.name,
              destinationPortName: ports.find(
                (p) => p.id === journey.destinationPortId
              )?.name,
            }))
          );
        }
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {journeys.map((journey) => (
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
    </div>
  );
}
