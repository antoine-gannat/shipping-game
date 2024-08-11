import React from "react";
import { IBaseProps } from "../../types";
import { Window } from "../Window/Window";
import { useStyles } from "./Ports.styles";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../../database";

export function Ports({}: IBaseProps): React.ReactElement {
  const ownedPorts = useLiveQuery(() =>
    db.ports.where("owned").equals("true").toArray()
  );
  const styles = useStyles();

  return (
    <Window title="Ports" className={styles.container}>
      <ul>
        {ownedPorts?.map((port) => (
          <li key={port.id}>{port.name}</li>
        ))}
      </ul>
    </Window>
  );
}
